import React from 'react';
import { cn } from "../ui/utils";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface UserAvatarProps {
  src?: string | null;
  name: string;
  className?: string;
}

export function UserAvatar({ src, name, className }: UserAvatarProps) {
  const isPlaceholder = !src || src.includes("unsplash.com");

  if (!isPlaceholder && src) {
    return (
      <ImageWithFallback
        src={src}
        alt={name}
        className={cn("rounded-full object-cover border border-gray-200 dark:border-gray-700", className)}
      />
    );
  }

  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={cn("rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold", className)}>
      {initial}
    </div>
  );
}
