export type UserRole = 'explorer' | 'planner' | 'local_provider' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  cover_image_url: string | null;
  bio: string | null;
  location: string | null;
  role: UserRole;
  status: UserStatus;
  reputation_score: number;
  diaries_count: number;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  is_following?: boolean;
  is_followed_by?: boolean;
}

export interface UpdateProfilePayload {
  full_name?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  cover_image_url?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
