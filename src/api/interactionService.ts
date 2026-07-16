import { supabase } from '@/lib/supabase';

export interface CommentItem {
  id: string;
  diary_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  author: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export const interactionService = {
  // === LIKES ===
  async checkUserLiked(diaryId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('diary_likes')
      .select('diary_id')
      .eq('diary_id', diaryId)
      .eq('user_id', userId)
      .limit(1);
    
    if (error) {
      console.warn("Check like error:", error);
      return false;
    }
    return !!data && data.length > 0;
  },

  async toggleLikeDiary(diaryId: string, userId: string): Promise<{ isLiked: boolean }> {
    const isCurrentlyLiked = await this.checkUserLiked(diaryId, userId);
    
    if (isCurrentlyLiked) {
      // Unlike
      const { error } = await supabase
        .from('diary_likes')
        .delete()
        .eq('diary_id', diaryId)
        .eq('user_id', userId);
      if (error) throw error;
        
      // Giam like_count trong diaries
      await supabase.rpc('decrement_like', { row_id: diaryId });
      return { isLiked: false };
    } else {
      // Like
      const { error } = await supabase
        .from('diary_likes')
        .insert({ diary_id: diaryId, user_id: userId });
      if (error) throw error;
        
      // Tang like_count trong diaries
      await supabase.rpc('increment_like', { row_id: diaryId });
      return { isLiked: true };
    }
  },

  // === BOOKMARKS ===
  async checkUserBookmarked(diaryId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('diary_bookmarks')
      .select('diary_id')
      .eq('diary_id', diaryId)
      .eq('user_id', userId)
      .limit(1);
    
    if (error) {
      console.warn("Check bookmark error:", error);
      return false;
    }
    return !!data && data.length > 0;
  },

  async toggleBookmarkDiary(diaryId: string, userId: string): Promise<{ isBookmarked: boolean }> {
    const isCurrentlyBookmarked = await this.checkUserBookmarked(diaryId, userId);
    
    if (isCurrentlyBookmarked) {
      const { error } = await supabase
        .from('diary_bookmarks')
        .delete()
        .eq('diary_id', diaryId)
        .eq('user_id', userId);
      if (error) throw error;
      return { isBookmarked: false };
    } else {
      const { error } = await supabase
        .from('diary_bookmarks')
        .insert({ diary_id: diaryId, user_id: userId });
      if (error) throw error;
      return { isBookmarked: true };
    }
  },

  // === COMMENTS ===
  async fetchComments(diaryId: string): Promise<CommentItem[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        diary_id,
        user_id,
        content,
        likes_count,
        created_at,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('diary_id', diaryId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((c: any) => ({
      ...c,
      author: Array.isArray(c.profiles) ? c.profiles[0] : c.profiles,
    }));
  },

  async addComment(diaryId: string, userId: string, content: string): Promise<CommentItem> {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        diary_id: diaryId,
        user_id: userId,
        content: content,
      })
      .select(`
        id,
        diary_id,
        user_id,
        content,
        likes_count,
        created_at,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    // Tang comment_count trong diaries
    const { error: rpcError } = await supabase.rpc('increment_comment', { row_id: diaryId });
    if (rpcError) {
      console.warn("RPC increment_comment failed:", rpcError);
    }

    return {
      ...data,
      author: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
    };
  },

  async updateComment(commentId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .update({ content: content })
      .eq('id', commentId);
    if (error) throw error;
  },

  async deleteComment(commentId: string, diaryId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (error) throw error;
    
    // Giảm comment_count trong diaries
    const { error: rpcError } = await supabase.rpc('decrement_comment', { row_id: diaryId });
    if (rpcError) {
      console.warn("RPC decrement_comment failed:", rpcError);
    }
  },

  // === FOLLOWS ===
  async checkIsFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.warn("Check follow error:", error);
      return false;
    }
    return !!data;
  },

  async toggleFollowUser(followerId: string, followingId: string): Promise<{ isFollowing: boolean }> {
    if (followerId === followingId) throw new Error("Không thể tự follow chính mình");

    const isCurrentlyFollowing = await this.checkIsFollowing(followerId, followingId);
    
    if (isCurrentlyFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);
        
      await supabase.rpc('decrement_follower', { target_user_id: followingId }).catch(()=>null);
      await supabase.rpc('decrement_following', { target_user_id: followerId }).catch(()=>null);

      return { isFollowing: false };
    } else {
      await supabase
        .from('follows')
        .insert({ follower_id: followerId, following_id: followingId });
        
      await supabase.rpc('increment_follower', { target_user_id: followingId }).catch(()=>null);
      await supabase.rpc('increment_following', { target_user_id: followerId }).catch(()=>null);

      return { isFollowing: true };
    }
  }
};
