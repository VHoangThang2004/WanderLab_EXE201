/**
 * Format a number to Vietnamese currency format.
 * @example formatCurrency(1500000) → "1.500.000₫"
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('vi-VN') + '₫';
}

/**
 * Format a date string to Vietnamese locale.
 * @example formatDate("2026-06-15") → "15 tháng 6, 2026"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day} tháng ${month}, ${year}`;
}

/**
 * Format relative time in Vietnamese.
 * @example timeAgo(Date.now() - 60000) → "1 phút trước"
 */
export function timeAgo(timestamp: number | string): string {
  const now = Date.now();
  const time = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const diff = now - time;

  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);

  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  if (weeks < 4) return `${weeks} tuần trước`;
  if (months < 12) return `${months} tháng trước`;
  return formatDate(new Date(time).toISOString());
}

/**
 * Shorten a large number for display.
 * @example shortenNumber(3200) → "3.2K"
 */
export function shortenNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
