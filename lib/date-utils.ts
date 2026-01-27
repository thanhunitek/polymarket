/**
 * Utility functions for date/time operations
 */

/**
 * Converts a UTC+0 date to UTC+7 (Vietnam time)
 * @param date - The date in UTC+0 (ISO string or Date object)
 * @returns Date object in UTC+7
 */
export function convertToUTC7(date: string | Date): Date {
  const dateObj = new Date(date);
  
  // Get UTC+0 time
  const utcHours = dateObj.getUTCHours();
  const utcMinutes = dateObj.getUTCMinutes();
  const utcSeconds = dateObj.getUTCSeconds();
  const utcDate = dateObj.getUTCDate();
  const utcMonth = dateObj.getUTCMonth();
  const utcYear = dateObj.getUTCFullYear();
  
  // Convert to UTC+7 (add 7 hours)
  // Note: JavaScript Date handles time zones automatically when using toLocaleString
  // But for exact conversion, we'll create a new date with UTC+7 offset
  const utc7Date = new Date(Date.UTC(utcYear, utcMonth, utcDate, utcHours, utcMinutes, utcSeconds));
  utc7Date.setHours(utc7Date.getHours() + 7);
  
  return utc7Date;
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
