export type DiaryStatus = 'draft' | 'pending' | 'published' | 'flagged' | 'removed';

export interface DiaryAuthor {
  id: string;
  full_name: string;
  avatar_url: string | null;
  diaries_count: number;
  followers_count: number;
}

export interface DiaryDay {
  day: number;
  title: string;
  activities: string[];
  budget: string;
}

export interface BudgetItem {
  category: string;
  amount: string;
  percentage: number;
}

export interface DiaryImage {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface ReviewPhoto {
  url: string;
  reviewer: string;
  avatar: string;
  caption: string;
  rating: number;
  date: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Comment {
  id: string;
  author: DiaryAuthor;
  content: string;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  replies?: Comment[];
}

export interface Diary {
  id: string;
  title: string;
  location: string;
  country: string;
  cover_image_url: string;
  gallery: DiaryImage[];
  review_photos: ReviewPhoto[];
  author: DiaryAuthor;
  trust_score: number;
  duration: string;
  dates: string;
  total_budget: string;
  group_size: string;
  description: string;
  timeline: DiaryDay[];
  budget_breakdown: BudgetItem[];
  budget_notes: string[];
  tips: string[];
  reviews: Review[];
  status: DiaryStatus;
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  created_at: string;
  updated_at: string;
}

/** Lightweight diary for feed/list views */
export interface DiaryFeedItem {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  image: string;
  location: string;
  date: string;
  caption: string;
  likes: number;
  comments: number;
  is_liked: boolean;
  is_saved: boolean;
  group_size: string;
}

export interface CreateDiaryPayload {
  title: string;
  location: string;
  country: string;
  description: string;
  duration: string;
  dates: string;
  total_budget: string;
  group_size: string;
  timeline: DiaryDay[];
  budget_breakdown: BudgetItem[];
  budget_notes: string[];
  tips: string[];
  status: 'draft' | 'pending' | 'published';
}

export interface DiaryFilters {
  style?: string;
  budget_min?: number;
  budget_max?: number;
  duration_min?: number;
  duration_max?: number;
  interests?: string[];
  search?: string;
  sort_by?: 'latest' | 'popular' | 'trust_score';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}
