/** Brand gradient */
export const BRAND_GRADIENT = 'from-[#ff3131] to-[#ff914d]';
export const BRAND_RED = '#ff3131';
export const BRAND_ORANGE = '#ff914d';
export const BRAND_BG = '#FFF5F3';

/** Travel styles for filtering */
export const TRAVEL_STYLES = [
  'Tất cả', 'Leo núi', 'Ẩm thực', 'Văn hóa', 'Sang trọng',
  'Tiết kiệm', 'Biển & Đảo', 'Thành phố',
] as const;

/** Interests for filtering */
export const ALL_INTERESTS = [
  'Thiên nhiên', 'Biển', 'Leo núi', 'Ẩm thực', 'Văn hóa', 'Lịch sử',
  'Chụp ảnh', 'Nghỉ dưỡng', 'Khám phá', 'Giải trí', 'Lặn biển',
  'Du thuyền', 'Trải nghiệm dân tộc',
] as const;

/** Duration filter options */
export const DURATION_OPTIONS = [
  { label: 'Tất cả', min: 1, max: 99 },
  { label: '1–3 ngày', min: 1, max: 3 },
  { label: '4–5 ngày', min: 4, max: 5 },
  { label: '6–7 ngày', min: 6, max: 7 },
  { label: 'Trên 7 ngày', min: 8, max: 99 },
] as const;

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

/** File upload limits */
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_COVER_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DIARY_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DIARY_IMAGES = 20;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Storage keys */
export const STORAGE_KEYS = {
  AUTH: 'wanderlab-auth',
  ACCESS_TOKEN: 'wanderlab_access_token',
  REFRESH_TOKEN: 'wanderlab_refresh_token',
  ITINERARIES: 'wanderlab_saved_itineraries',
} as const;
