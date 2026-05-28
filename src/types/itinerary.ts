export interface DayPlan {
  day: number;
  title: string;
  emoji: string;
  activities: string[];
  budget: string;
}

export interface BudgetBreakdownItem {
  label: string;
  amount: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  destination: string;
  destination_region: string;
  destination_image: string;
  duration: string;
  group_size: string;
  budget_level: string;
  interests: string[];
  estimated_total: string;
  days: DayPlan[];
  budget_breakdown: BudgetBreakdownItem[];
  is_ai_generated: boolean;
  created_at: string;
}

export interface CreateItineraryPayload {
  destination: string;
  destination_region: string;
  destination_image: string;
  duration: string;
  group_size: string;
  budget_level: string;
  interests: string[];
  estimated_total: string;
  days: DayPlan[];
  budget_breakdown: BudgetBreakdownItem[];
  is_ai_generated: boolean;
}

export interface AIItineraryRequest {
  destination: string;
  duration_days: number;
  budget_level: 'low' | 'medium' | 'high';
  group_size: number;
  interests: string[];
}

export interface AIItineraryResponse {
  itinerary: CreateItineraryPayload;
  ai_notes: string;
}
