/**
 * Activepieces Code Piece: Invoice Normalizer & Mathematical Reconciler
 * Author: AppSolve Central
 * Purpose: Normalizes European/US currency formats, validates tax math, and computes idempotency hash.
 */

import { createHash } from 'crypto';

interface RawInvoicePayload {
  vendor_name?: string;
  invoice_number?: string;
  transaction_date?: string;
  currency?: string;
  raw_subtotal?: number | string;
  raw_tax_amount?: number | string;
  raw_total_amount?: number | string;
  confidence_score?: number;
  document_url?: string;
}

interface NormalizedInvoiceOutput {
  transaction_id: string;
  date: string;
  vendor_name: string;
  category: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  verification_status: 'VERIFIED' | 'RECONCILIATION_WARNING';
  math_variance: number;
  document_url: string;
  processed_at: string;
}

function sanitizeCurrencyNumber(input: number | string | undefined): number {
  if (typeof input === 'number') return Math.round(input * 100) / 100;
  if (!input) return 0.0;

  let str = input.toString().trim();
  // Strip out currency symbols and spaces
  str = str.replace(/[$€£¥₹\s]/g, '');

  // Detect European comma decimal vs US point decimal
  const lastComma = str.lastIndexOf(',');
  const lastDot = str.lastIndexOf('.');

  if (lastComma > lastDot) {
    // European style: 1.250,50 -> 1250.50
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma) {
    // American style: 1,250.50 -> 1250.50
    str = str.replace(/,/g, '');
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0.0 : Math.round(parsed * 100) / 100;
}

export const code = async (inputs: { raw: RawInvoicePayload }): Promise<NormalizedInvoiceOutput> => {
  const raw = inputs.raw || {};

  const vendor = (raw.vendor_name || 'UNKNOWN VENDOR').trim().toUpperCase();
  const dateStr = raw.transaction_date || new Date().toISOString().split('T')[0];
  const currency = (raw.currency || 'USD').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
  const docUrl = raw.document_url || 'https://drive.google.com';

  const subtotal = sanitizeCurrencyNumber(raw.raw_subtotal);
  const tax = sanitizeCurrencyNumber(raw.raw_tax_amount);
  const total = sanitizeCurrencyNumber(raw.raw_total_amount);

  // Deterministic mathematical reconciliation check: subtotal + tax === total
  const calculatedTotal = Math.round((subtotal + tax) * 100) / 100;
  const variance = Math.round(Math.abs(calculatedTotal - total) * 100) / 100;

  // 1-cent variance threshold for rounding differences
  const isVerified = variance <= 0.01;
  const verification_status = isVerified ? 'VERIFIED' : 'RECONCILIATION_WARNING';

  // Deterministic SHA-256 idempotency hash (Vendor + Date + Total)
  const hashKey = `${vendor}|${dateStr}|${total.toFixed(2)}|${currency}`;
  const transaction_id = 'TX_' + createHash('sha256').update(hashKey).digest('hex').substring(0, 12).toUpperCase();

  // Basic auto-categorization based on common vendor keywords
  let category = 'General Expense';
  if (/AWS|GOOGLE CLOUD|AZURE|DIGITALOCEAN|HETZNER|CLOUDFLARE/i.test(vendor)) {
    category = 'Cloud Infrastructure';
  } else if (/UBER|LYFT|AIRBNB|DELTA|UNITED/i.test(vendor)) {
    category = 'Travel & Transport';
  } else if (/STARBUCKS|RESTAURANT|CAFE|DINER|FOOD/i.test(vendor)) {
    category = 'Meals & Entertainment';
  } else if (/SLACK|NOTION|GITHUB|OPENAI|FIGMA/i.test(vendor)) {
    category = 'Software Subscriptions';
  }

  return {
    transaction_id,
    date: dateStr,
    vendor_name: vendor,
    category,
    currency,
    subtotal,
    tax_amount: tax,
    total_amount: total,
    verification_status,
    math_variance: variance,
    document_url: docUrl,
    processed_at: new Date().toISOString()
  };
};
