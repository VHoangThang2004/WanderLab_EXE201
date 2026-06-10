/**
 * AI Chat Service — gọi qua /api/ai/chat (Vite proxy).
 * Client KHÔNG biết endpoint thật hay API key.
 * Hỗ trợ cả streaming và non-streaming.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatOptions {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
  onChunk?: (text: string) => void;
  signal?: AbortSignal;
}

export interface AIChatResponse {
  content: string;
  error?: string;
}

const AI_CHAT_ENDPOINT = '/api/ai/chat';

const SYSTEM_PROMPT = `Bạn là trợ lý du lịch AI của WanderLab — nền tảng du lịch Việt Nam.
Bạn giúp người dùng:
• Tìm điểm đến phù hợp tại Việt Nam
• Lập kế hoạch và ngân sách chuyến đi
• Gợi ý lộ trình, ẩm thực, trải nghiệm
• Trả lời thắc mắc về du lịch Việt Nam

Trả lời ngắn gọn, thân thiện, dùng emoji phù hợp. Dùng tiếng Việt trừ khi người dùng hỏi bằng tiếng Anh.
Nếu được hỏi ngoài chủ đề du lịch, hãy nhẹ nhàng hướng lại về du lịch.`;

/**
 * Gọi AI chat với streaming support.
 * Trả về full response text khi stream kết thúc.
 */
export async function sendAIChat(options: AIChatOptions): Promise<AIChatResponse> {
  const { messages, model, stream = true, onChunk, signal } = options;

  // Prepend system prompt
  const fullMessages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  try {
    const response = await fetch(AI_CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: fullMessages,
        model,
        stream,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        content: '',
        error: errorData.error || `Lỗi kết nối AI (${response.status})`,
      };
    }

    if (!stream) {
      // Non-streaming: parse JSON response (OpenAI-compatible format)
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return { content };
    }

    // Streaming: parse SSE
    const reader = response.body?.getReader();
    if (!reader) {
      return { content: '', error: 'Stream không khả dụng' };
    }

    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;
            onChunk?.(fullContent);
          }
        } catch {
          // Skip malformed SSE lines
        }
      }
    }

    return { content: fullContent };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { content: '', error: 'Đã hủy request' };
    }
    return { content: '', error: err.message || 'Lỗi không xác định' };
  }
}
