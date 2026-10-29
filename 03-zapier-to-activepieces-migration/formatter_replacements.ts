// Zapier Formatter Replacement Snippets in Activepieces (Zero Cost TypeScript)

// 1. Date Formatter (replaces Zapier Date/Time)
export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// 2. Text Splitter & Extractor (replaces Zapier Text Split)
export function extractDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase().trim() || '';
}

// 3. Number & Currency Normalizer (replaces Zapier Numbers)
export function parseCurrency(input: string): number {
  return parseFloat(input.replace(/[^0-9.-]+/g, '')) || 0;
}
