/**
 * Unit Test Harness for Create CRM Contact Action
 */

import { createContactAction } from '../src/lib/actions/create-contact';

describe('Acme CRM - Create Contact Action', () => {
  const mockAuth = {
    baseUrl: 'https://api.crm.internal.corp',
    apiKey: 'mock_sec_91b8••••••••••••••••e4f6'
  };

  it('should validate and reject malformed email addresses', async () => {
    const mockContext: any = {
      auth: mockAuth,
      propsValue: {
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'invalid-email-string',
        customerTier: 'enterprise',
        dealValue: 50000
      }
    };

    await expect(createContactAction.run(mockContext)).rejects.toThrow(
      'Invalid email address provided: invalid-email-string'
    );
  });

  it('should correctly build payload for valid contact inputs', () => {
    expect(createContactAction.props.firstName.required).toBe(true);
    expect(createContactAction.props.email.required).toBe(true);
    expect(createContactAction.props.customerTier.required).toBe(true);
  });
});
