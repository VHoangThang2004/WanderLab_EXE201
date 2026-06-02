import { supabase } from '@/lib/supabase';

export interface FriendProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
  followers_count: number;
}

export const friendService = {
  /**
   * Kiểm tra xem current user có đang follow user kia không
   */
  async checkIsFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('Check follow error:', error);
      return false;
    }
    return !!data;
  },

  /**
   * Follow một người dùng
   */
  async followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) throw new Error("Cannot follow yourself");
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId });

    if (error) throw error;
    // Tăng count (cần trigger hoặc RPC, nhưng ta có thể bỏ qua nếu setup trigger ở DB)
  },

  /**
   * Bỏ follow
   */
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  },

  /**
   * Lấy danh sách đang theo dõi (Following)
   */
  async getFollowing(userId: string): Promise<FriendProfile[]> {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        following:profiles!follows_following_id_fkey(
          id, full_name, avatar_url, bio, followers_count
        )
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('getFollowing error:', error);
      return [];
    }

    return (data || []).map((item: any) => item.following);
  },

  /**
   * Lấy danh sách người theo dõi (Followers)
   */
  async getFollowers(userId: string): Promise<FriendProfile[]> {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower:profiles!follows_follower_id_fkey(
          id, full_name, avatar_url, bio, followers_count
        )
      `)
      .eq('following_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('getFollowers error:', error);
      return [];
    }

    return (data || []).map((item: any) => item.follower);
  }
};
