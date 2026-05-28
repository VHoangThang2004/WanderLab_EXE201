import { ImageWithFallback } from "../figma/ImageWithFallback";
import { MapPin, Check } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

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
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followers, setFollowers] = useState(followersCount);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers(isFollowing ? followers - 1 : followers + 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
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
            className="font-bold text-gray-900 hover:text-[#ff3131] transition-colors block truncate"
          >
            {name}
          </Link>
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <MapPin size={12} />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span><strong className="text-gray-900">{diariesCount}</strong> nhật ký</span>
            <span>•</span>
            <span><strong className="text-gray-900">{followers.toLocaleString("vi-VN")}</strong> người theo dõi</span>
          </div>
        </div>

        <button
          onClick={handleFollow}
          className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all flex items-center gap-1.5 whitespace-nowrap ${
            isFollowing
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-md"
          }`}
        >
          {isFollowing ? (
            <>
              <Check size={14} />
              Đang theo dõi
            </>
          ) : (
            "Theo dõi"
          )}
        </button>
      </div>
    </div>
  );
}
