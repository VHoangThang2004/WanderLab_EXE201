import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

/**
 * Vite plugin proxy cho AI endpoint.
 * Client chỉ gọi /api/ai/chat → plugin forward sang vRouter server-side.
 * API key và endpoint thật KHÔNG bao giờ lộ ra browser bundle.
 */
function aiProxyPlugin(): Plugin {
  let apiKey = ''
  let apiEndpoint = ''
  let apiModel = ''

  return {
    name: 'ai-proxy',
    configResolved(config) {
      // Load env vars (non-VITE_ prefixed → chỉ có server-side mới thấy)
      const env = loadEnv(config.mode, config.root, '')
      apiKey = env.API_LLM_AI || ''
      apiEndpoint = env.API_LLM_ENDPOINT || ''
      apiModel = env.API_LLM_MODEL || 'claudible/claude-haiku-4-5'
    },
    configureServer(server) {
      server.middlewares.use('/api/ai/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey || !apiEndpoint) {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'AI service not configured. Set API_LLM_AI and API_LLM_ENDPOINT in .env' }))
          return
        }

        // Đọc body từ client
        const chunks: Buffer[] = []
        for await (const chunk of req) {
          chunks.push(Buffer.from(chunk))
        }
        const body = JSON.parse(Buffer.concat(chunks).toString())

        try {
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: body.model || apiModel,
              messages: body.messages,
              stream: body.stream ?? true,
            }),
          })

          if (!response.ok) {
            const errorText = await response.text()
            res.writeHead(response.status, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: `vRouter error: ${response.status}`, detail: errorText }))
            return
          }

          // Stream response về client
          if (body.stream !== false) {
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            })

            const reader = response.body?.getReader()
            if (!reader) {
              res.end()
              return
            }

            const decoder = new TextDecoder()
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(decoder.decode(value, { stream: true }))
            }
            res.end()
          } else {
            // Non-streaming
            const data = await response.json()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(data))
          }
        } catch (err: any) {
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Failed to reach AI backend', detail: err.message }))
        }
      })

      // ── /api/ai/itinerary — AI tự động tạo lịch trình (non-streaming) ──
      server.middlewares.use('/api/ai/itinerary', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey || !apiEndpoint) {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'AI service not configured. Set API_LLM_AI and API_LLM_ENDPOINT in .env' }))
          return
        }

        const chunks: Buffer[] = []
        for await (const chunk of req) {
          chunks.push(Buffer.from(chunk))
        }
        const body = JSON.parse(Buffer.concat(chunks).toString())

        // Build structured prompt for itinerary generation
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
}`

        const userPrompt = `Tạo lịch trình du lịch với thông tin sau:
- Điểm đến: ${body.destination}
- Số ngày: ${body.duration_days}
- Ngân sách: ${body.budget_level}
- Số người: ${body.group_size}
- Sở thích: ${(body.interests || []).join(', ')}

Trả về JSON theo format đã quy định. Chỉ trả JSON, không thêm gì khác.`

        try {
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
          })

          if (!response.ok) {
            const errorText = await response.text()
            res.writeHead(response.status, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: `vRouter error: ${response.status}`, detail: errorText }))
            return
          }

          const data = await response.json()
          const content = data.choices?.[0]?.message?.content || ''

          // Parse AI response JSON
          try {
            // Loại bỏ markdown code block nếu AI vẫn wrap
            const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            const itinerary = JSON.parse(cleaned)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ itinerary, ai_notes: itinerary.ai_notes || '' }))
          } catch {
            // Nếu parse fail, trả raw content để client fallback
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ itinerary: null, raw: content, error: 'AI response was not valid JSON' }))
          }
        } catch (err: any) {
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Failed to reach AI backend', detail: err.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      figmaAssetResolver(),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],

    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    }
  }
})