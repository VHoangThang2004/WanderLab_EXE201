/**
 * AI Itinerary Service — gọi /api/ai/itinerary (Vite proxy).
 * Tạo lịch trình du lịch tự động bằng AI.
 */

export interface ItineraryRequest {
  destination: string;
  duration_days: number;
  budget_level: string;
  group_size: number | string;
  interests: string[];
}

export interface ItineraryDay {
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

export interface GeneratedItinerary {
  destination: string;
  duration_days: number;
  ai_notes: string;
  days: ItineraryDay[];
  budget_breakdown: BudgetItem[];
  total_estimate: string;
  tips?: string[];
}

export interface ItineraryResponse {
  itinerary: GeneratedItinerary | null;
  ai_notes?: string;
  raw?: string;
  error?: string;
}

const AI_ITINERARY_ENDPOINT = '/api/ai/itinerary';

/**
 * Gọi AI tạo lịch trình.
 * Trả về structured itinerary data.
 */
export async function generateItinerary(
  request: ItineraryRequest,
  signal?: AbortSignal
): Promise<ItineraryResponse> {
  try {
    const response = await fetch(AI_ITINERARY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        itinerary: null,
        error: errorData.error || `Lỗi kết nối AI (${response.status})`,
      };
    }

    const data = await response.json();

    if (data.error && !data.itinerary) {
      return { itinerary: null, error: data.error, raw: data.raw };
    }

    return {
      itinerary: data.itinerary,
      ai_notes: data.ai_notes,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { itinerary: null, error: 'Đã hủy request' };
    }
    return { itinerary: null, error: err.message || 'Lỗi không xác định' };
  }
}
