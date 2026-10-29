// Mathematical Reconciliation Firewall for Invoices
export function reconcileInvoice(subtotal: number, tax: number, total: number): { isValid: boolean; calculatedTotal: number; diff: number } {
  const calc = Math.round((subtotal + tax) * 100) / 100;
  const tot = Math.round(total * 100) / 100;
  const diff = Math.abs(calc - tot);
  return {
    isValid: diff <= 0.02, // Allow max 2-cent rounding tolerance
    calculatedTotal: calc,
    diff: diff
  };
}
