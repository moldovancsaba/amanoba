/**
 * Stripe Minimum Payment Amounts
 * 
 * What: Defines minimum payment amounts per currency for Stripe
 * Why: Stripe requires minimum amounts to prevent transaction fees from being too high relative to the charge
 * 
 * Reference: https://docs.stripe.com/currencies
 */

export const STRIPE_MINIMUM_AMOUNTS: Record<string, number> = {
  usd: 50,      // $0.50 USD
  eur: 50,      // €0.50 EUR
  huf: 175,     // 175 Ft HUF
  gbp: 30,      // £0.30 GBP
  // Add more currencies as needed
};

/**
 * Get minimum amount for a currency
 * 
 * @param currency - Currency code (lowercase)
 * @returns Minimum amount in smallest currency unit (cents, etc.)
 */
export function getStripeMinimum(currency: string): number {
  return STRIPE_MINIMUM_AMOUNTS[currency.toLowerCase()] || 50; // Default to 50 if unknown
}

/**
 * Check if amount meets Stripe minimum
 * 
 * @param amount - Amount in smallest currency unit
 * @param currency - Currency code
 * @returns true if amount meets minimum, false otherwise
 */
export function meetsStripeMinimum(amount: number, currency: string): boolean {
  const minimum = getStripeMinimum(currency);
  return amount >= minimum;
}

/**
 * Get formatted minimum amount for display
 * 
 * @param currency - Currency code
 * @returns Formatted string like "$0.50" or "175 Ft"
 */
export function getFormattedMinimum(currency: string): string {
  const minimum = getStripeMinimum(currency);
  const currencyUpper = currency.toUpperCase();
  
  switch (currency.toLowerCase()) {
    case 'usd':
      return `$${(minimum / 100).toFixed(2)}`;
    case 'eur':
      return `€${(minimum / 100).toFixed(2)}`;
    case 'gbp':
      return `£${(minimum / 100).toFixed(2)}`;
    case 'huf':
      return `${minimum} Ft`;
    default:
      return `${minimum} ${currencyUpper}`;
  }
}
