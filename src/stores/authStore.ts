import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (updates: {
    full_name?: string;
    bio?: string | null;
    location?: string | null;
    avatar_url?: string | null;
    cover_image_url?: string | null;
    plan?: string;
  }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  uploadCover: (file: File) => Promise<string>;
}

/**
 * Helper: build User object from Supabase auth user + optional profile row.
 * Works even if profiles table doesn't exist yet.
 */
function buildUser(
  authUser: { id: string; email?: string | null; created_at: string; user_metadata?: Record<string, unknown> },
  profile?: Record<string, unknown> | null
): User {
  return {
    id: authUser.id,
    email: authUser.email || '',
    full_name: (profile?.full_name as string) || (authUser.user_metadata?.full_name as string) || '',
    avatar_url: (profile?.avatar_url as string) || null,
    cover_image_url: (profile?.cover_image_url as string) || null,
    bio: (profile?.bio as string) || null,
    location: (profile?.location as string) || null,
    role: (profile?.role as User['role']) || 'explorer',
    status: (profile?.status as User['status']) || 'active',
    plan: (profile?.plan as string) || 'free',
    reputation_score: (profile?.reputation_score as number) || 0,
    diaries_count: (profile?.diaries_count as number) || 0,
    followers_count: (profile?.followers_count as number) || 0,
    following_count: (profile?.following_count as number) || 0,
    created_at: authUser.created_at,
    updated_at: (profile?.updated_at as string) || authUser.created_at,
  };
}

/**
 * Helper: try to fetch profile, return null if table doesn't exist.
 */
async function fetchProfile(userId: string) {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  } catch {
    // profiles table may not exist yet — that's ok
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          const profile = await fetchProfile(data.user.id);
          const user = buildUser(data.user, profile);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email, password, fullName) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
            },
          });

          if (error) throw error;

          // Sign out immediately — user must verify email before login
          await supabase.auth.signOut();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/profile`,
          },
        });
        if (error) throw error;
      },

      loginWithFacebook: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook',
          options: {
            redirectTo: `${window.location.origin}/profile`,
          },
        });
        if (error) throw error;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      refreshSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            const user = buildUser(session.user, profile);
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          if (error) throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updatePassword: async (password: string) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.updateUser({ password });
          if (error) throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');
        set({ isLoading: true });
        try {
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

          if (error) throw error;

          set({
            user: { ...user, ...updates },
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      uploadAvatar: async (file: File) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return data.publicUrl;
      },

      uploadCover: async (file: File) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('covers')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('covers').getPublicUrl(filePath);
        return data.publicUrl;
      },
    }),
    {
      name: 'wanderlab-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
