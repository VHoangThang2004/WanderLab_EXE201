import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  media_url?: string;
  media_type?: string;
  reactions?: Record<string, string[]>;
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastActive?: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export const messageService = {
  /**
   * Fetch recent chats for a user
   */
  async fetchRecentChats(userId: string): Promise<ChatContact[]> {
    if (!userId) return [];

    // Query to get all unique users the current user has chatted with
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id, content, created_at, status, sender_id, receiver_id,
        sender:profiles!sender_id(id, full_name, avatar_url),
        receiver:profiles!receiver_id(id, full_name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching recent chats:", error);
      return [];
    }

    const contactsMap = new Map<string, ChatContact>();

    messages?.forEach((msg: any) => {
      const isSender = msg.sender_id === userId;
      const otherUser = isSender ? msg.receiver : msg.sender;
      
      // Handle aliased query results
      const profile = Array.isArray(otherUser) ? otherUser[0] : otherUser;
      
      if (!profile) return;

      if (!contactsMap.has(profile.id)) {
        // Parse time nicely
        const date = new Date(msg.created_at);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        contactsMap.set(profile.id, {
          id: profile.id,
          name: profile.full_name || 'Người dùng',
          avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
          isOnline: true, // Mock online status
          lastMessage: isSender ? `Bạn: ${msg.content}` : msg.content,
          time: timeStr,
          unread: (!isSender && msg.status !== 'read') ? 1 : 0
        });
      } else {
        const contact = contactsMap.get(profile.id)!;
        if (!isSender && msg.status !== 'read') {
          contact.unread += 1;
        }
      }
    });

    return Array.from(contactsMap.values());
  },

  /**
   * Fetch messages between two users
   */
  async fetchMessages(userId: string, otherUserId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return data as ChatMessage[];
  },

  async sendMessage(senderId: string, receiverId: string, content: string, mediaUrl?: string, mediaType?: string): Promise<ChatMessage | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        media_url: mediaUrl,
        media_type: mediaType,
        status: 'sent'
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return null;
    }

    return data as ChatMessage;
  },

  /**
   * Update a message
   */
  async updateMessage(messageId: string, senderId: string, newContent: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .update({ content: newContent })
      .match({ id: messageId, sender_id: senderId }); // Ensure only sender can edit

    if (error) {
      console.error("Error updating message:", error);
      return false;
    }
    return true;
  },

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string, senderId: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .match({ id: messageId, sender_id: senderId }); // Ensure only sender can delete

    if (error) {
      console.error("Error deleting message:", error);
      return false;
    }
    return true;
  },

  /**
   * Delete entire chat with a user
   */
  async deleteChat(userId: string, otherUserId: string): Promise<boolean> {
    try {
      // Delete messages sent by user
      const { error: err1 } = await supabase
        .from('messages')
        .delete()
        .eq('sender_id', userId)
        .eq('receiver_id', otherUserId);
        
      if (err1) console.error("Error deleting sent messages:", err1);

      // Delete messages received by user (might fail if RLS restricts it)
      const { error: err2 } = await supabase
        .from('messages')
        .delete()
        .eq('sender_id', otherUserId)
        .eq('receiver_id', userId);
        
      if (err2) console.error("Error deleting received messages:", err2);

      return true;
    } catch (err) {
      console.error("Exception deleting chat:", err);
      return false;
    }
  },

  /**
   * Upload media to storage
   */
  async uploadChatMedia(file: File): Promise<{ url: string; type: string } | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat_media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage.from('chat_media').getPublicUrl(filePath);
      return {
        url: data.publicUrl,
        type: file.type.startsWith('image/') ? 'image' : 'file'
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      return null;
    }
  },

  /**
   * React to a message
   */
  async reactToMessage(messageId: string, userId: string, reaction: string): Promise<void> {
    // First, get the current reactions
    const { data: msg } = await supabase.from('messages').select('reactions').eq('id', messageId).single();
    if (!msg) return;

    let reactions: Record<string, string[]> = msg.reactions || {};
    
    // Toggle reaction logic
    if (reactions[reaction]) {
      if (reactions[reaction].includes(userId)) {
        reactions[reaction] = reactions[reaction].filter(id => id !== userId);
        if (reactions[reaction].length === 0) {
          delete reactions[reaction];
        }
      } else {
        reactions[reaction].push(userId);
      }
    } else {
      reactions[reaction] = [userId];
    }

    const { error } = await supabase.from('messages').update({ reactions }).eq('id', messageId);
    if (error) {
      console.error("Error reacting to message:", error);
    }
  },

  /**
   * Mark messages as read
   */
  async markAsRead(receiverId: string, senderId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('receiver_id', receiverId)
      .eq('sender_id', senderId)
      .neq('status', 'read');

    if (error) {
      console.error("Error marking messages as read:", error);
    }
  },

  /**
   * Subscribe to messages in real-time
   */
  subscribeToMessages(userId: string, onNewMessage: (payload: any) => void) {
    if (!userId) return null;

    const channelName = `messages_sync_${userId}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          const record = (payload.new && Object.keys(payload.new as object).length > 0) ? payload.new : payload.old;
          const typedRecord = record as Record<string, any>;
          // Ensure the message involves the current user
          if (typedRecord && (typedRecord.receiver_id === userId || typedRecord.sender_id === userId)) {
            onNewMessage(payload);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Realtime synced for user: ${userId}`);
        }
      });

    return channel;
  }
};
