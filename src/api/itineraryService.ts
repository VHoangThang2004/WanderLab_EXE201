import { supabase } from '@/lib/supabase';

export interface DayPlan {
  day: number;
  title: string;
  emoji: string;
  activities: string[];
  budget: string;
}

export interface BudgetItem {
  label: string;
  amount: string;
}

export interface CreateItineraryPayload {
  destination: string;
  destination_region?: string;
  destination_image?: string;
  duration: string;
  group_size: string;
  budget_level: string;
  interests?: string[];
  estimated_total?: string;
  days: DayPlan[];
  budget_breakdown: BudgetItem[];
  is_ai_generated?: boolean;
}

export const itineraryService = {
  /**
   * Lưu lịch trình mới vào database
   */
  async saveItineraryToDb(payload: CreateItineraryPayload) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        user_id: userData.user.id,
        destination: payload.destination,
        destination_region: payload.destination_region,
        destination_image: payload.destination_image,
        duration: payload.duration,
        group_size: payload.group_size,
        budget_level: payload.budget_level,
        interests: payload.interests || [],
        estimated_total: payload.estimated_total,
        days: payload.days || [],
        budget_breakdown: payload.budget_breakdown || [],
        is_ai_generated: payload.is_ai_generated || false,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  /**
   * Lấy danh sách lịch trình đã lưu của người dùng hiện tại
   */
  async fetchMyItineraries() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch itineraries error:', error);
      return [];
    }
    
    return data;
  },

  /**
   * Xóa một lịch trình
   */
  async deleteItinerary(id: string) {
    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
