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
    const reaction = await this.getUserReaction(diaryId, userId);
    return !!reaction;
  },

  async getUserReaction(diaryId: string, userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('diary_likes')
      .select('reaction_type')
      .eq('diary_id', diaryId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.warn("Check reaction error:", error);
      return null;
    }
    return data ? data.reaction_type : null;
  },

  async toggleLikeDiary(diaryId: string, userId: string): Promise<{ isLiked: boolean }> {
    const res = await this.setReactionDiary(diaryId, userId, 'like', true);
    return { isLiked: !!res.currentReaction };
  },

  async setReactionDiary(diaryId: string, userId: string, reactionType: string, toggleOnSame: boolean = false): Promise<{ currentReaction: string | null }> {
    const existingReaction = await this.getUserReaction(diaryId, userId);
    
    if (existingReaction) {
      if (existingReaction === reactionType && toggleOnSame) {
        // Remove reaction (unlike)
        await supabase.from('diary_likes').delete().eq('diary_id', diaryId).eq('user_id', userId);
        await supabase.rpc('decrement_like', { row_id: diaryId });
        return { currentReaction: null };
      } else {
        // Change reaction
        await supabase.from('diary_likes').update({ reaction_type: reactionType }).eq('diary_id', diaryId).eq('user_id', userId);
        return { currentReaction: reactionType };
      }
    } else {
      // New reaction
      await supabase.from('diary_likes').insert({ diary_id: diaryId, user_id: userId, reaction_type: reactionType });
      await supabase.rpc('increment_like', { row_id: diaryId });
      return { currentReaction: reactionType };
    }
  },

  // === BOOKMARKS ===
  async checkUserBookmarked(diaryId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('diary_bookmarks')
      .select('id')
      .eq('diary_id', diaryId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.warn("Check bookmark error:", error);
      return false;
    }
    return !!data;
  },

  async toggleBookmarkDiary(diaryId: string, userId: string): Promise<{ isBookmarked: boolean }> {
    const isCurrentlyBookmarked = await this.checkUserBookmarked(diaryId, userId);
    
    if (isCurrentlyBookmarked) {
      await supabase
        .from('diary_bookmarks')
        .delete()
        .eq('diary_id', diaryId)
        .eq('user_id', userId);
      return { isBookmarked: false };
    } else {
      await supabase
        .from('diary_bookmarks')
        .insert({ diary_id: diaryId, user_id: userId });
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
        author:profiles (
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
      author: Array.isArray(c.author) ? c.author[0] : c.author,
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
        author:profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    // Tang comment_count trong diaries (có thể dùng RPC hoặc Trigger, ở đây ta dùng RPC nếu có)
    await supabase.rpc('increment_comment', { row_id: diaryId }).catch(() => {
      // bỏ qua lỗi nếu chưa viết hàm RPC increment_comment
    });

    return {
      ...data,
      author: Array.isArray(data.author) ? data.author[0] : data.author,
    };
  }
};
