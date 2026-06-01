import { ImageWithFallback } from "../figma/ImageWithFallback";
import { MapPin, Check } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useLanguageStore } from "@/stores";

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
  name: string;
  avatar: string;
  location: string;
  diariesCount: number;
  followersCount: number;
  isFollowing?: boolean;
}

export function UserCard({
  name,
  avatar,
  location,
  diariesCount,
  followersCount,
  isFollowing: initialIsFollowing = false,
}: UserCardProps) {
  const { language } = useLanguageStore();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followers, setFollowers] = useState(followersCount);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers(isFollowing ? followers - 1 : followers + 1);
  };

  return (
    <div className="bg-white dark:bg-[#030213] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${name}`}>
          <ImageWithFallback
            src={avatar}
            alt={name}
            className="w-14 h-14 rounded-full object-cover"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link
            to={`/profile/${name}`}
            className="font-bold text-gray-900 dark:text-white hover:text-[#ff3131] transition-colors block truncate"
          >
            {name}
          </Link>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <MapPin size={12} />
            <span className="truncate">{translateLocation(location, language)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <span><strong className="text-gray-900 dark:text-white">{diariesCount}</strong> {language === 'vi' ? 'nhật ký' : 'journals'}</span>
            <span>•</span>
            <span><strong className="text-gray-900 dark:text-white">{followers.toLocaleString(language === 'vi' ? "vi-VN" : "en-US")}</strong> {language === 'vi' ? 'người theo dõi' : 'followers'}</span>
          </div>
        </div>

        <button
          onClick={handleFollow}
          className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all flex items-center gap-1.5 whitespace-nowrap ${
            isFollowing
              ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700"
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
