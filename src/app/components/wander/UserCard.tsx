import { ImageWithFallback } from "../figma/ImageWithFallback";
import { MapPin, Check } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useLanguageStore, useAuthStore, useUIStore } from "@/stores";
import { friendService } from "@/api/friendService";

const translateLocation = (loc: string, lang: string) => {
  if (lang === 'vi') return loc;
  const dict: Record<string, string> = {
    "Hà Nội": "Hanoi",
    "TP. Hồ Chí Minh": "Ho Chi Minh City",
    "Đà Nẵng": "Da Nang",
  };
  return dict[loc] || loc;
};

interface UserCardProps {
  id?: string;
  name: string;
  avatar: string;
  location: string;
  diariesCount: number;
  followersCount: number;
  isFollowing?: boolean;
}

export function UserCard({
  id,
  name,
  avatar,
  location,
  diariesCount,
  followersCount,
  isFollowing: initialIsFollowing = false,
}: UserCardProps) {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followers, setFollowers] = useState(followersCount);
  const [isMutating, setIsMutating] = useState(false);

  const handleFollow = async () => {
    if (isMutating) return;

    if (id && user?.id) {
      setIsMutating(true);
      try {
        if (isFollowing) {
          await friendService.unfollowUser(user.id, id);
          setIsFollowing(false);
          setFollowers(prev => Math.max(prev - 1, 0));
          addToast({ type: 'success', message: `Đã hủy theo dõi ${name}.` });
        } else {
          await friendService.followUser(user.id, id);
          setIsFollowing(true);
          setFollowers(prev => prev + 1);
          addToast({ type: 'success', message: `Đã theo dõi ${name}!` });
        }
      } catch (err: any) {
        console.error("Follow error:", err);
        addToast({ type: 'error', message: 'Lỗi thực hiện theo dõi: ' + err.message });
      } finally {
        setIsMutating(false);
      }
    } else {
      // Local state fallback for mock mode
      setIsFollowing(!isFollowing);
      setFollowers(isFollowing ? followers - 1 : followers + 1);
      addToast({ type: 'success', message: isFollowing ? `Đã hủy theo dõi (Mock Mode)` : `Đã theo dõi (Mock Mode)` });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${id || name}`}>
          <ImageWithFallback
            src={avatar}
            alt={name}
            className="w-14 h-14 rounded-full object-cover"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link
            to={`/profile/${id || name}`}
            className="font-bold text-gray-900 hover:text-[#ff3131] transition-colors block truncate"
          >
            {name}
          </Link>
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <MapPin size={12} />
            <span className="truncate">{translateLocation(location, language)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span><strong className="text-gray-900">{diariesCount}</strong> {language === 'vi' ? 'nhật ký' : 'journals'}</span>
            <span>•</span>
            <span><strong className="text-gray-900">{followers.toLocaleString(language === 'vi' ? "vi-VN" : "en-US")}</strong> {language === 'vi' ? 'người theo dõi' : 'followers'}</span>
          </div>
        </div>

        <button
          onClick={handleFollow}
          disabled={isMutating}
          className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50 ${
            isFollowing
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-md"
          }`}
        >
          {isFollowing ? (
            <>
              <Check size={14} />
              {language === 'vi' ? 'Đang theo dõi' : 'Following'}
            </>
          ) : (
            language === 'vi' ? 'Theo dõi' : 'Follow'
          )}
        </button>
      </div>
    </div>
  );
}
