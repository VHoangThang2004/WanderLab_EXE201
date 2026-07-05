export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = process.env.API_LLM_AI || '';
  const apiEndpoint = process.env.API_LLM_ENDPOINT || '';
  const apiModel = process.env.API_LLM_MODEL || 'claudible/claude-haiku-4-5';

  if (!apiKey || !apiEndpoint) {
    return new Response(JSON.stringify({ error: 'AI service not configured on server.' }), { 
      status: 503, 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();

    const systemPrompt = `Bạn là AI chuyên tạo lịch trình du lịch Việt Nam cho WanderLab.
Khi nhận yêu cầu tạo lịch trình, bạn PHẢI trả về JSON hợp lệ (KHÔNG markdown, KHÔNG giải thích thêm).

Format JSON bắt buộc:
{
  "destination": "tên điểm đến",
  "duration_days": số ngày,
  "ai_notes": "ghi chú ngắn về lịch trình",
  "days": [
    {
      "day": 1,
      "title": "tiêu đề ngày",
      "emoji": "emoji phù hợp",
      "activities": ["hoạt động 1", "hoạt động 2", "hoạt động 3", "hoạt động 4"],
      "budget": "chi phí ước tính ngày đó (VNĐ)"
    }
  ],
  "budget_breakdown": [
    { "label": "hạng mục", "amount": "số tiền VNĐ" }
  ],
  "total_estimate": "tổng chi phí ước tính/người",
  "tips": ["mẹo 1", "mẹo 2"]
}`;

    const userPrompt = `Tạo lịch trình du lịch với thông tin sau:
- Điểm đến: ${body.destination}
- Số ngày: ${body.duration_days}
- Ngân sách: ${body.budget_level}
- Số người: ${body.group_size}
- Sở thích: ${(body.interests || []).join(', ')}

Trả về JSON theo format đã quy định. Chỉ trả JSON, không thêm gì khác.`;

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `Server error: ${response.status}`, detail: errorText }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse AI response JSON
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const itinerary = JSON.parse(cleaned);
      return new Response(JSON.stringify({ itinerary, ai_notes: itinerary.ai_notes || '' }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch {
      return new Response(JSON.stringify({ itinerary: null, raw: content, error: 'AI response was not valid JSON' }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to reach AI backend', detail: err.message }), { 
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
