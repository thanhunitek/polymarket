/**
 * Utility functions for date/time operations
 */

/**
 * Converts a UTC date string or Date object to a Date object
 * No manual timezone conversion needed - toLocaleString handles it
 * @param date - The date in UTC (ISO string or Date object)
 * @returns Date object
 */
export function convertToUTC7(date: string | Date): Date {
  return new Date(date);
}

/**
 * Formats a date to display in UTC+7 with time in "01 Feb 2026 12:00AM" format
 * @param date - The date in UTC+0 (ISO string or Date object)
 * @returns Formatted string in UTC+7 (e.g., "01 Feb 2026 12:00AM")
 */
export function formatUTC7DateTime(date: string | Date): string {
  const utc7Date = convertToUTC7(date);
  return utc7Date.toLocaleString('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(',', '');
}

/**
 * Formats a date to display just the date part in UTC+7
 * @param date - The date in UTC+0 (ISO string or Date object)
 * @returns Formatted date string in UTC+7 (e.g., "01 Feb 2026")
 */
export function formatUTC7Date(date: string | Date): string {
  const utc7Date = convertToUTC7(date);
  return utc7Date.toLocaleString('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).replace(',', '');
}
