import { useCallback, useEffect, useState } from 'react';
import { useAuthStore, useLanguageStore } from '@/stores';
import { toast } from 'sonner';

export type ActionType = 'create_diary' | 'create_itinerary' | 'ai_diary' | 'ai_itinerary';

// Define limits based on plan
const PLAN_LIMITS = {
  free: {
    create_diary: 4,
    create_itinerary: 2,
    ai_diary: 8,
    ai_itinerary: 4,
    max_images: 5,
    max_videos: 1,
    max_video_res: 720, // 720p
  },
  plus: {
    create_diary: 10,
    create_itinerary: 5,
    ai_diary: 20,
    ai_itinerary: 10,
    max_images: 12,
    max_videos: 2,
    max_video_res: 1080, // 1080p
  },
  pro: {
    create_diary: 25,
    create_itinerary: 12,
    ai_diary: 50,
    ai_itinerary: 25,
    max_images: 30,
    max_videos: 5,
    max_video_res: 2160, // 4k
  },
};

const ERROR_MESSAGES_VI: Record<ActionType, string> = {
  create_diary: 'Bạn đã đạt giới hạn đăng bài Nhật Ký hôm nay. Hãy nâng cấp gói để đăng thêm nhé!',
  create_itinerary: 'Bạn đã đạt giới hạn tạo Lịch Trình hôm nay. Hãy nâng cấp gói để tạo thêm nhé!',
  ai_diary: 'Bạn đã hết lượt dùng AI Trợ lý Nhật Ký hôm nay. Hãy nâng cấp gói!',
  ai_itinerary: 'Bạn đã hết lượt dùng AI Trợ lý Lịch Trình hôm nay. Hãy nâng cấp gói!',
};

const ERROR_MESSAGES_EN: Record<ActionType, string> = {
  create_diary: 'You have reached your daily Journal post limit. Upgrade to post more!',
  create_itinerary: 'You have reached your daily Itinerary creation limit. Upgrade to create more!',
  ai_diary: 'You have used all your AI Journal Assist tokens for today. Upgrade for more!',
  ai_itinerary: 'You have used all your AI Itinerary Assist tokens for today. Upgrade for more!',
};

// Key prefix for localStorage
const USAGE_KEY_PREFIX = 'wanderlab_usage_';

export function useUsageLimits() {
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const plan = user?.plan || 'free';
  const limits = PLAN_LIMITS[plan];

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const getUsageKey = (action: ActionType) => {
    return `${USAGE_KEY_PREFIX}${user?.id || 'guest'}_${action}_${getTodayDateString()}`;
  };

  const getUsage = useCallback((action: ActionType): number => {
    try {
      const key = getUsageKey(action);
      const val = localStorage.getItem(key);
      return val ? parseInt(val, 10) : 0;
    } catch (e) {
      return 0;
    }
  }, [user]);

  const checkLimit = useCallback((action: ActionType, showToast: boolean = true): boolean => {
    const currentUsage = getUsage(action);
    const limit = limits[action];

    if (currentUsage >= limit) {
      if (showToast) {
        const msgs = language === 'vi' ? ERROR_MESSAGES_VI : ERROR_MESSAGES_EN;
        toast.error(msgs[action]);
      }
      return false; // Limit reached
    }
    return true; // Limit not reached
  }, [getUsage, limits, language]);

  const incrementUsage = useCallback((action: ActionType) => {
    try {
      const key = getUsageKey(action);
      const currentUsage = getUsage(action);
      localStorage.setItem(key, (currentUsage + 1).toString());
    } catch (e) {
      console.error('Failed to update usage limit', e);
    }
  }, [getUsage]);

  const resetUsage = useCallback(() => {
    try {
      const actions: ActionType[] = ['create_diary', 'create_itinerary', 'ai_diary', 'ai_itinerary'];
      actions.forEach(action => {
        const key = getUsageKey(action);
        localStorage.removeItem(key);
      });
    } catch (e) {
      console.error('Failed to reset usage limits', e);
    }
  }, [user]);

  const checkMediaLimits = useCallback((currentImages: number, newImages: number, currentVideos: number, newVideos: number) => {
    if (currentImages + newImages > limits.max_images) {
      toast.error(language === 'vi' ? `Bạn chỉ được tải lên tối đa ${limits.max_images} ảnh theo gói ${plan.toUpperCase()}.` : `You can only upload up to ${limits.max_images} images with the ${plan.toUpperCase()} plan.`);
      return false;
    }
    if (currentVideos + newVideos > limits.max_videos) {
      toast.error(language === 'vi' ? `Bạn chỉ được tải lên tối đa ${limits.max_videos} video theo gói ${plan.toUpperCase()}.` : `You can only upload up to ${limits.max_videos} videos with the ${plan.toUpperCase()} plan.`);
      return false;
    }
    return true;
  }, [limits, plan, language]);

  const validateVideoResolution = useCallback(async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const maxRes = limits.max_video_res;
      // We will check the video dimensions
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        // We consider resolution as the height or the smallest dimension usually, but often 720p means 1280x720, so Math.min(width, height)
        const resolution = Math.min(video.videoWidth, video.videoHeight);
        
        if (resolution > maxRes + 50) { // adding slight buffer for strange aspect ratios
          toast.error(
            language === 'vi' 
              ? `Video vượt quá độ phân giải cho phép (${maxRes}p) của gói ${plan.toUpperCase()}. Hãy nâng cấp gói hoặc chọn video nhẹ hơn.`
              : `Video exceeds maximum resolution (${maxRes}p) for ${plan.toUpperCase()} plan. Please upgrade or choose a lower resolution video.`
          );
          resolve(false);
        } else {
          resolve(true);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        // If we can't parse it, we might just allow it or reject it, let's allow it but warn.
        console.warn('Could not parse video metadata to check resolution.');
        resolve(true); 
      };

      video.src = URL.createObjectURL(file);
    });
  }, [limits, plan, language]);

  return {
    limits,
    getUsage,
    checkLimit,
    incrementUsage,
    resetUsage,
    checkMediaLimits,
    validateVideoResolution,
  };
}
