/**
 * Acme CRM Custom Piece Definition
 * Author: AppSolve Central
 * Purpose: Connects Activepieces workflows directly to internal enterprise CRM endpoints.
 */

import { createPiece, PieceAuth, Property } from '@activepieces/pieces-framework';
import { createContactAction } from './lib/actions/create-contact';
import { sendAlertAction } from './lib/actions/send-alert';

export const acmeAuth = PieceAuth.CustomAuth({
  description: 'Authenticate with your internal Acme CRM instance using your API key and base URL.',
  props: {
    baseUrl: Property.ShortText({
      displayName: 'Base API URL',
      description: 'The base URL of your private CRM API (e.g. https://api.crm.internal.corp)',
      required: true,
      defaultValue: 'https://api.crm.internal.corp'
    }),
    apiKey: Property.SecretText({
      displayName: 'API Key',
      description: 'Your 32-byte private application secret key',
      required: true
    })
  },
  required: true
});

export const acmePiece = createPiece({
  displayName: 'Acme CRM and Alert Engine',
  auth: acmeAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/custom-crm.png',
  authors: ['AppSolve Central'],
  actions: [
    createContactAction,
    sendAlertAction
  ],
  triggers: []
});
