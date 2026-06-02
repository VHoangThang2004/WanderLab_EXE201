import { useState, useEffect } from "react";
import { itineraryService } from "@/api/itineraryService";

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

export interface SavedItinerary {
  id: string;
  destination: string;
  destinationRegion: string;
  destinationImage: string;
  duration: string;
  groupSize: string;
  budget: string;       // budget level label
  interests: string[];
  estimatedTotal: string;
  savedAt: string;
  savedTimestamp: number;
  days: DayPlan[];
  budgetBreakdown: BudgetItem[];
}

const STORAGE_KEY = "wanderlab_saved_itineraries";

function loadFromStorage(): SavedItinerary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: SavedItinerary[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* ignore */ }
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days === 1) return "Hôm qua";
  return `${days} ngày trước`;
}

export function useSavedItineraries() {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>(loadFromStorage);

  useEffect(() => {
    // Sync local storage with DB when hook mounts
    const fetchFromDb = async () => {
      try {
        const dbItems = await itineraryService.fetchMyItineraries();
        if (dbItems && dbItems.length > 0) {
          const mappedItems: SavedItinerary[] = dbItems.map((item: any) => ({
            id: item.id,
            destination: item.destination,
            destinationRegion: item.destination_region || '',
            destinationImage: item.destination_image || '',
            duration: item.duration,
            groupSize: item.group_size,
            budget: item.budget_level,
            interests: item.interests || [],
            estimatedTotal: item.estimated_total || '',
            savedAt: timeAgo(new Date(item.created_at).getTime()),
            savedTimestamp: new Date(item.created_at).getTime(),
            days: item.days || [],
            budgetBreakdown: item.budget_breakdown || [],
          }));
          setItineraries(mappedItems);
          saveToStorage(mappedItems);
        }
      } catch (err) {
        console.warn("Failed to fetch itineraries from DB:", err);
      }
    };

    fetchFromDb();

    const onStorage = () => setItineraries(loadFromStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saveItinerary = async (item: Omit<SavedItinerary, "id" | "savedAt" | "savedTimestamp">) => {
    // 1. Tạo temp ID
    const tempId = `it_${Date.now()}`;
    const newItem: SavedItinerary = {
      ...item,
      id: tempId,
      savedAt: "Vừa xong",
      savedTimestamp: Date.now(),
    };

    // 2. Cập nhật local state ngay lập tức (Optimistic UI)
    setItineraries((prev) => {
      const updated = [newItem, ...prev];
      saveToStorage(updated);
      return updated;
    });

    // 3. Sync lên DB
    try {
      const realId = await itineraryService.saveItineraryToDb({
        destination: item.destination,
        destination_region: item.destinationRegion,
        destination_image: item.destinationImage,
        duration: item.duration,
        group_size: item.groupSize,
        budget_level: item.budget,
        interests: item.interests,
        estimated_total: item.estimatedTotal,
        days: item.days,
        budget_breakdown: item.budgetBreakdown,
        is_ai_generated: true, // Assuming this comes from CreateItinerary AI flow
      });

      // Thay thế temp ID bằng ID thật từ DB
      setItineraries((prev) => {
        const updated = prev.map(i => i.id === tempId ? { ...i, id: realId } : i);
        saveToStorage(updated);
        return updated;
      });
      return realId;
    } catch (err) {
      console.error("Failed to save itinerary to DB:", err);
      return tempId; // Vẫn trả về tempId để UI không lỗi
    }
  };

  const removeItinerary = async (id: string) => {
    // Xoá DB
    try {
      // Bỏ qua nếu ID là dạng temp chưa kịp sync (hiếm xảy ra)
      if (!id.startsWith('it_')) {
        await itineraryService.deleteItinerary(id);
      }
    } catch (err) {
      console.warn("Failed to delete itinerary from DB", err);
    }

    // Xoá local
    setItineraries((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const withFreshTimes = itineraries.map((i) => ({
    ...i,
    savedAt: timeAgo(i.savedTimestamp),
  }));

  return { itineraries: withFreshTimes, saveItinerary, removeItinerary };
}
