import { v4 as uuidv4 } from 'uuid';
import { CURRENCIES } from '../constants/index.js';

/**
 * Format a number as currency string.
 */
export function formatCurrency(amount: number, currencyCode: string = 'NPR'): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  const symbol = currency?.symbol ?? currencyCode;

  return `${symbol} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generate a UUID v4 for sync-safe unique identifiers.
 */
export function generateSyncId(): string {
  return uuidv4();
}

/**
 * Convert a string to a URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
