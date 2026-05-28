import { useState, useEffect } from "react";

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
    const onStorage = () => setItineraries(loadFromStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saveItinerary = (item: Omit<SavedItinerary, "id" | "savedAt" | "savedTimestamp">) => {
    const newItem: SavedItinerary = {
      ...item,
      id: `it_${Date.now()}`,
      savedAt: "Vừa xong",
      savedTimestamp: Date.now(),
    };
    setItineraries((prev) => {
      const updated = [newItem, ...prev];
      saveToStorage(updated);
      return updated;
    });
    return newItem.id;
  };

  const removeItinerary = (id: string) => {
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
