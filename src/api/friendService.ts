import { supabase } from '@/lib/supabase';

export interface FriendProfile {
    id: string;
    full_name: string;
    avatar_url: string | null;
    location: string | null;
    diaries_count: number;
    followers_count: number;
    following_count: number;
}

export const friendService = {
    /**
     * Follow a user
     */
    async followUser(followerId: string, followingId: string): Promise<void> {
        const { error } = await supabase
            .from('follows')
            .insert({
                follower_id: followerId,
                following_id: followingId,
            });

        if (error) {
            throw error;
        }
    },

    /**
     * Unfollow a user
     */
    async unfollowUser(followerId: string, followingId: string): Promise<void> {
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followingId);

        if (error) {
            throw error;
        }
    },

    /**
     * Check if a user is following another
     */
    async checkIsFollowing(followerId: string, followingId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', followerId)
            .eq('following_id', followingId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is row not found
            console.warn("Check following error:", error);
            return false;
        }

        return !!data;
    },

    /**
     * Fetch followers, following, friends (mutual follow) and requests (follow you but not followed back)
     */
    async fetchFriendData(userId: string) {
        if (!userId) {
            return {
                requests: [],
                friends: [],
                following: [],
                followers: [],
            };
        }

        // 1. Fetch people who follow the current user
        const { data: followers, error: err1 } = await supabase
            .from('follows')
            .select(`
        follower_id,
        follower:profiles!follower_id (
          id,
          full_name,
          avatar_url,
          location,
          diaries_count,
          followers_count,
          following_count
        )
      `)
            .eq('following_id', userId);

        if (err1) {
            console.error("Error fetching followers:", err1);
            throw err1;
        }

        // 2. Fetch people whom the current user follows
        const { data: following, error: err2 } = await supabase
            .from('follows')
            .select(`
        following_id,
        following:profiles!following_id (
          id,
          full_name,
          avatar_url,
          location,
          diaries_count,
          followers_count,
          following_count
        )
      `)
            .eq('follower_id', userId);

        if (err2) {
            console.error("Error fetching following:", err2);
            throw err2;
        }

        // Safely extract profile objects supporting aliased names
        const followingProfiles: FriendProfile[] = (following || [])
            .map((f: any) => {
                const p = f.following || f.profiles;
                return Array.isArray(p) ? p[0] : p;
            })
            .filter(Boolean);

        const followerProfiles: FriendProfile[] = (followers || [])
            .map((f: any) => {
                const p = f.follower || f.profiles;
                return Array.isArray(p) ? p[0] : p;
            })
            .filter(Boolean);

        const followingIds = new Set(followingProfiles.map((p) => p.id));

        // Friend requests: followed us (followerProfiles) but we do not follow back (not in followingIds)
        const requests = followerProfiles.filter((p) => !followingIds.has(p.id));

        // Friends: mutual followers (in both lists)
        const friends = followerProfiles.filter((p) => followingIds.has(p.id));

        return {
            requests,
            friends,
            following: followingProfiles,
            followers: followerProfiles,
        };
    }
};
