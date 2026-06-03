import { supabase } from '@/lib/supabase';
import type { DiaryFeedItem, CreateDiaryPayload } from '@/types/diary';
import { DIARY_DATA } from '@/app/data/diaries';

export const diaryService = {
  /**
   * Lấy danh sách nhật ký cho Feed ở trang chủ.
   * Nếu Database trống hoặc lỗi, sẽ fallback về Mock Data để giữ UI đẹp.
   */
  async fetchFeedDiaries(): Promise<DiaryFeedItem[]> {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('diaries')
        .select(`
          id,
          location,
          cover_image_url,
          created_at,
          description,
          group_size,
          likes_count,
          comments_count,
          author:profiles(id, full_name, avatar_url),
          likes:diary_likes(user_id),
          bookmarks:diary_bookmarks(user_id)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.warn('Supabase fetch error:', error);
      } else if (data && data.length > 0) {
        // Return real data mapped to FeedItem interface
        return data.map((item: any) => ({
          id: item.id,
          author: {
            id: item.author?.id || 'unknown',
            name: item.author?.full_name || 'Unknown User',
            avatar: item.author?.avatar_url || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04', // fallback avatar
          },
          image: item.cover_image_url || 'https://images.unsplash.com/photo-1547024842-7c86b2226ef5',
          location: item.location,
          date: new Date(item.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
          caption: item.description,
          likes: item.likes_count || 0,
          comments: item.comments_count || 0,
          is_liked: currentUser ? item.likes?.some((l: any) => l.user_id === currentUser.id) : false,
          is_saved: currentUser ? item.bookmarks?.some((b: any) => b.user_id === currentUser.id) : false,
          isLiked: currentUser ? item.likes?.some((l: any) => l.user_id === currentUser.id) : false,
          isSaved: currentUser ? item.bookmarks?.some((b: any) => b.user_id === currentUser.id) : false,
          group_size: item.group_size || '',
        }));
      }
    } catch (err) {
      console.warn("Failed to fetch from Supabase, falling back to mock data", err);
    }
    
    // FALLBACK TO MOCK DATA (nếu DB chưa có dữ liệu)
    return Object.values(DIARY_DATA).map(diary => ({
      id: diary.id,
      author: {
        id: diary.author.name,
        name: diary.author.name,
        avatar: diary.author.avatar,
      },
      image: diary.image,
      location: diary.location,
      date: diary.dates,
      caption: diary.description,
      likes: diary.trustScore * 3, // mock likes
      comments: 10,
      is_liked: false,
      is_saved: false,
      group_size: diary.groupSize,
    }));
  },

  /**
   * Upload ảnh bìa lên Supabase Storage bucket 'diaries'
   */
  async uploadDiaryImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('diaries')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage.from('diaries').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Lấy chi tiết nhật ký
   */
  async fetchDiaryById(id: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select(`
          *,
          author:profiles(id, full_name, avatar_url, diaries_count, followers_count),
          timeline:diary_days(*),
          budget_breakdown:diary_budget_breakdown(*)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          title: data.title,
          location: data.location,
          country: data.country,
          image: data.cover_image_url || 'https://images.unsplash.com/photo-1547024842-7c86b2226ef5',
          gallery: [
            "https://images.unsplash.com/photo-1506461883276-594a12b11cf3",
            "https://images.unsplash.com/photo-1528127269322-539801943592",
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19"
          ], 
          reviewPhotos: [
            {
              url: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86",
              caption: "Cảnh biển buổi sáng thật sự tuyệt vời!",
              reviewer: "Tuấn Lê",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
              rating: 5,
              date: "12/05/2026"
            },
            {
              url: "https://images.unsplash.com/photo-1534430480872-3498386e7856",
              caption: "Món ăn địa phương rất ngon.",
              reviewer: "Mai Vũ",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
              rating: 4,
              date: "10/05/2026"
            },
            {
              url: "https://images.unsplash.com/photo-1528659101185-3e2849e89d87",
              caption: "Không gian yên tĩnh và trong lành.",
              reviewer: "Hoàng Tuấn",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
              rating: 5,
              date: "05/05/2026"
            }
          ],
          author: {
            name: data.author?.full_name || 'Người dùng ẩn danh',
            avatar: data.author?.avatar_url || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
            diariesCount: data.author?.diaries_count || 0,
            followersCount: data.author?.followers_count || 0,
          },
          trustScore: data.trust_score || 90,
          duration: data.duration,
          dates: data.dates,
          totalBudget: data.total_budget,
          groupSize: data.group_size,
          description: data.description,
          likesCount: data.likes_count || 0,
          commentsCount: data.comments_count || 0,
          timeline: data.timeline?.map((day: any) => ({
            day: day.day_number,
            title: day.title,
            activities: day.activities || [],
            budget: day.budget
          })) || [],
          budgetBreakdown: data.budget_breakdown?.map((item: any) => ({
            category: item.category,
            amount: item.amount,
            percentage: item.percentage
          })) || [],
          budgetNotes: data.budget_notes || [],
          tips: data.tips || [],
          reviews: [
            {
              author: "Phạm Minh",
              rating: 5,
              date: "1 ngày trước",
              text: "Lịch trình này rất chi tiết, tôi đã đi theo và có một chuyến đi tuyệt vời!"
            }
          ], 
          related: []
        };
      }
    } catch(e) {
      console.warn("fetchDiaryById failed", e);
    }
    return DIARY_DATA[id] || Object.values(DIARY_DATA)[0];
  },

  /**
   * Fetch tất cả published diaries cho trang Explore
   */
  async fetchExploreDiaries(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select(`
          id, title, location, country, cover_image_url, duration, total_budget, trust_score,
          author:profiles(id, full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map((d: any) => {
          // Parse budget to number (millions VNĐ) for filtering
          const budgetStr = d.total_budget || "0";
          const budgetVal = parseInt(budgetStr.replace(/\D/g, '')) || 0;
          const budgetNum = budgetVal / 1000000;
          
          // Parse duration to days
          const durationDays = parseInt(d.duration) || 0;

          return {
            id: d.id,
            title: d.title,
            location: d.location,
            country: d.country,
            image: d.cover_image_url || 'https://images.unsplash.com/photo-1547024842-7c86b2226ef5',
            style: 'Khám phá', // Default
            interests: ['Văn hóa', 'Ẩm thực'], // Default mock
            budget: `${budgetNum.toFixed(1)} triệu ₫`,
            budgetNum,
            duration: d.duration,
            durationDays,
            trustScore: d.trust_score || 90,
            author: d.author?.full_name || 'Người dùng ẩn danh'
          };
        });
      }
    } catch(e) {
      console.warn("fetchExploreDiaries failed", e);
    }
    
    // Fallback to mock logic
    const { VIETNAMESE_DESTINATIONS } = await import('@/app/data/destinations');
    return VIETNAMESE_DESTINATIONS.map((dest) => ({
      id: dest.id || dest.name,
      title: dest.name,
      location: dest.name,
      country: "Việt Nam",
      image: dest.image,
      style: dest.style,
      interests: dest.interests,
      budget: dest.budget,
      budgetNum: dest.budgetNum,
      duration: dest.duration,
      durationDays: dest.durationDays,
      trustScore: Math.floor(Math.random() * 10) + 90,
      author: dest.bestMonth ? "Nguyễn Thị Mai" : "Trần Văn Minh"
    }));
  },

  /**
   * Tạo nhật ký mới vào DB
   */
  async createDiary(payload: CreateDiaryPayload, coverImageUrl: string): Promise<string> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    // 1. Insert diary record
    const { data: diary, error: diaryError } = await supabase
      .from('diaries')
      .insert({
        user_id: userData.user.id,
        title: payload.title,
        location: payload.location,
        country: payload.country,
        cover_image_url: coverImageUrl,
        duration: payload.duration,
        dates: payload.dates,
        total_budget: payload.total_budget,
        group_size: payload.group_size,
        description: payload.description,
        status: payload.status,
        tips: payload.tips || [],
        budget_notes: payload.budget_notes || [],
      })
      .select('id')
      .single();

    if (diaryError) throw diaryError;
    const diaryId = diary.id;

    // 2. Insert diary_days (nếu có)
    if (payload.timeline && payload.timeline.length > 0) {
      const daysToInsert = payload.timeline.map((day) => ({
        diary_id: diaryId,
        day_number: day.day,
        title: day.title,
        activities: day.activities,
        budget: day.budget,
      }));
      await supabase.from('diary_days').insert(daysToInsert);
    }

    // 3. Insert budget_items (nếu có)
    if (payload.budget_breakdown && payload.budget_breakdown.length > 0) {
      const budgetToInsert = payload.budget_breakdown.map((item) => ({
        diary_id: diaryId,
        category: item.category,
        amount: item.amount,
        percentage: item.percentage,
      }));
      await supabase.from('diary_budget_breakdown').insert(budgetToInsert);
    }

    return diaryId;
  },

  /**
   * Lấy danh sách nhật ký của một user cụ thể
   */
  async fetchUserDiaries(userId: string): Promise<DiaryFeedItem[]> {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select(`
          id,
          location,
          cover_image_url,
          created_at,
          description,
          group_size,
          likes_count,
          comments_count,
          author:profiles(id, full_name, avatar_url),
          likes:diary_likes(user_id),
          bookmarks:diary_bookmarks(user_id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch user diaries error:', error);
      } else if (data) {
        return data.map((item: any) => ({
          id: item.id,
          author: {
            id: item.author?.id || 'unknown',
            name: item.author?.full_name || 'Unknown User',
            avatar: item.author?.avatar_url || '',
          },
          image: item.cover_image_url || 'https://images.unsplash.com/photo-1547024842-7c86b2226ef5',
          location: item.location,
          date: new Date(item.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
          caption: item.description,
          likes: item.likes_count || 0,
          comments: item.comments_count || 0,
          is_liked: item.likes?.some((l: any) => l.user_id === userId) || false,
          is_saved: item.bookmarks?.some((b: any) => b.user_id === userId) || false,
          isLiked: item.likes?.some((l: any) => l.user_id === userId) || false,
          isSaved: item.bookmarks?.some((b: any) => b.user_id === userId) || false,
          group_size: item.group_size || '',
        }));
      }
    } catch (err) {
      console.warn("Failed to fetch user diaries from Supabase", err);
    }
    return [];
  },

  /**
   * Lấy danh sách nhật ký đã lưu (bookmarked) của user
   */
  async fetchSavedDiaries(userId: string): Promise<DiaryFeedItem[]> {
    try {
      const { data, error } = await supabase
        .from('diary_bookmarks')
        .select(`
          diary:diaries(
            id,
            location,
            cover_image_url,
            created_at,
            description,
            group_size,
            likes_count,
            comments_count,
            author:profiles(id, full_name, avatar_url),
            likes:diary_likes(user_id),
            bookmarks:diary_bookmarks(user_id)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch saved diaries error:', error);
      } else if (data) {
        return data
          .map((item: any) => item.diary)
          .filter(Boolean)
          .map((item: any) => ({
            id: item.id,
            author: {
              id: item.author?.id || 'unknown',
              name: item.author?.full_name || 'Unknown User',
              avatar: item.author?.avatar_url || '',
            },
            image: item.cover_image_url || 'https://images.unsplash.com/photo-1547024842-7c86b2226ef5',
            location: item.location,
            date: new Date(item.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
            caption: item.description,
            likes: item.likes_count || 0,
            comments: item.comments_count || 0,
            is_liked: item.likes?.some((l: any) => l.user_id === userId) || false,
            is_saved: true,
            isLiked: item.likes?.some((l: any) => l.user_id === userId) || false,
            isSaved: true,
            group_size: item.group_size || '',
          }));
      }
    } catch (err) {
      console.warn("Failed to fetch saved diaries from Supabase", err);
    }
    return [];
  }
};
