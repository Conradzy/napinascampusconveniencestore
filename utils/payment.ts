import { formatCurrency } from "./format";

type PaymentResult =
  | { valid: true; paidCents: number; changeCents: number }
  | { valid: false; error: string };

export function validatePayment(rawPayment: string, totalCents: number): PaymentResult {
  const value = rawPayment.trim();

  // Check the string first: Number("") would incorrectly accept blank cash as zero.
  // Accept ordinary peso amounts with at most two decimal places.
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(value)) {
    return { valid: false, error: "Please enter a valid payment amount." };
  }

  // Work in whole centavos to avoid floating-point errors in change.
  const paidCents = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(paidCents) || paidCents < 0) {
    return { valid: false, error: "Please enter a valid payment amount." };
  }

  if (paidCents < totalCents) {
    return {
      valid: false,
      error: `Insufficient payment. Please enter at least ${formatCurrency(totalCents / 100)}.`,
    };
  }

  return { valid: true, paidCents, changeCents: paidCents - totalCents };
}
