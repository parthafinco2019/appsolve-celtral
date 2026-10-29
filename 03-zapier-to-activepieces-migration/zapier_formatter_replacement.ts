/**
 * ==============================================================================
 * ZAPIER FORMATTER REPLACEMENT SNIPPETS FOR ACTIVEPIECES CODE PIECES
 * Zero Task Fees | Sub-Millisecond Execution | 100% Type-Safe
 * ==============================================================================
 */

// 1. TEXT SPLIT (Replaces Zapier Formatter > Text > Split Text)
export const splitFullName = (fullName: string) => {
  const parts = (fullName || '').trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
    initials: parts.map(p => p[0]?.toUpperCase()).join('')
  };
};

// 2. PHONE NORMALIZER (Replaces Zapier Formatter > Numbers > Phone)
export const normalizePhoneE164 = (rawPhone: string, defaultCountryCode = '1') => {
  const digits = (rawPhone || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return `+${defaultCountryCode}${digits}`;
  }
  return `+${digits}`;
};

// 3. DATE/TIME FORMATTER (Replaces Zapier Formatter > Date/Time > Format)
export const formatTimestamp = (isoDateString: string, timeZone = 'America/New_York') => {
  const date = new Date(isoDateString || Date.now());
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return {
    formattedDate: new Intl.DateTimeFormat('en-US', options).format(date),
    unixSeconds: Math.floor(date.getTime() / 1000),
    isoUtc: date.toISOString()
  };
};

// 4. REGEX EXTRACTOR (Replaces Zapier Formatter > Text > Extract Pattern)
export const extractOrderDetails = (inputText: string) => {
  const invoiceMatch = inputText.match(/INV-[\d]{4,8}/i);
  const amountMatch = inputText.match(/\$[\d,]+(?:\.[\d]{2})?/);
  
  return {
    invoiceNumber: invoiceMatch ? invoiceMatch[0].toUpperCase() : null,
    extractedAmount: amountMatch ? Number(amountMatch[0].replace(/[$,]/g, '')) : 0.00
  };
};

// 5. ARRAY LINE-ITEM RECONCILER (Replaces Zapier Formatter > Utilities > Line Items)
interface RawLineItem {
  sku: string;
  qty: number;
  price: number;
}

export const reconcileLineItems = (items: RawLineItem[]) => {
  const subtotal = (items || []).reduce((acc, item) => acc + (item.qty * item.price), 0);
  const tax = Number((subtotal * 0.0825).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return {
    itemCount: items.length,
    subtotal,
    tax,
    total,
    markdownSummary: items.map(i => `- ${i.qty}x ${i.sku} @ $${i.price.toFixed(2)}`).join('\n')
  };
};
