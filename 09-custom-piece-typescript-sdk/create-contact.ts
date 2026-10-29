/**
 * Create CRM Contact Action
 * Author: AppSolve Central
 * Validates customer properties and dispatches authenticated REST requests.
 */

import { createAction, Property, HttpMethod, httpClient } from '@activepieces/pieces-framework';
import { acmeAuth } from '../../index';

export const createContactAction = createAction({
  auth: acmeAuth,
  name: 'create_contact',
  displayName: 'Create CRM Contact',
  description: 'Adds a new customer record to Acme CRM with automatic deduplication.',
  props: {
    firstName: Property.ShortText({
      displayName: 'First Name',
      description: 'Customer given name',
      required: true
    }),
    lastName: Property.ShortText({
      displayName: 'Last Name',
      description: 'Customer family name',
      required: true
    }),
    email: Property.ShortText({
      displayName: 'Email Address',
      description: 'Corporate customer email address',
      required: true
    }),
    customerTier: Property.StaticDropdown({
      displayName: 'Customer Tier',
      description: 'Service level agreement tier',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'Free Tier', value: 'free' },
          { label: 'Professional Tier', value: 'pro' },
          { label: 'Enterprise Tier', value: 'enterprise' }
        ]
      }
    }),
    dealValue: Property.Number({
      displayName: 'Estimated Deal Value ($)',
      description: 'Potential pipeline value in USD',
      required: false
    })
  },
  async run(context) {
    const { baseUrl, apiKey } = context.auth;
    const { firstName, lastName, email, customerTier, dealValue } = context.propsValue;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email address provided: ${email}`);
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      tier: customerTier,
      deal_value: dealValue ? Number(dealValue) : 0,
      source: 'Activepieces Workflow'
    };

    try {
      const response = await httpClient.sendRequest({
        method: HttpMethod.POST,
        url: `${baseUrl.replace(/\/$/, '')}/api/v1/contacts`,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload
      });

      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          contact_id: response.body.id || `CT_${Date.now()}`,
          status_code: response.status,
          contact: response.body
        };
      }

      throw new Error(`CRM API rejected contact creation with status ${response.status}: ${JSON.stringify(response.body)}`);
    } catch (error: any) {
      // Handle rate limits and connection rejections gracefully
      if (error?.response?.status === 429) {
        throw new Error('Acme CRM rate limit exceeded. Please back off and retry in 60 seconds.');
      }
      if (error?.response?.status === 401) {
        throw new Error('Authentication failed: Invalid Acme CRM API key. Please verify your connection.');
      }
      throw new Error(`Acme CRM request failed: ${error.message || error}`);
    }
  }
});
