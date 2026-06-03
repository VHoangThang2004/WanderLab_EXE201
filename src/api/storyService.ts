import { supabase } from '@/lib/supabase';

export interface StoryItem {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  author: {
    name: string;
    avatar: string;
  };
}

export const storyService = {
  /**
   * Tải ảnh Story lên Supabase Storage bucket 'diaries'
   */
  async uploadStoryImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `stories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('diaries')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage.from('diaries').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Tạo story mới
   */
  async createStory(imageUrl: string, caption?: string): Promise<any> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('stories')
      .insert({
        user_id: userData.user.id,
        image_url: imageUrl,
        caption: caption || null
      })
      .select(`
        *,
        author:profiles(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Lấy toàn bộ các tin đang hoạt động
   */
  async fetchActiveStories(): Promise<StoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          user_id,
          image_url,
          caption,
          created_at,
          author:profiles(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        return data.map((s: any) => ({
          id: s.id,
          user_id: s.user_id,
          image_url: s.image_url,
          caption: s.caption,
          created_at: s.created_at,
          author: {
            name: s.author?.full_name || 'Người dùng ẩn danh',
            avatar: s.author?.avatar_url || '',
          }
        }));
      }
    } catch (err) {
      console.warn("fetchActiveStories failed", err);
    }
    return [];
  }
};
