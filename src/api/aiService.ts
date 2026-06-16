import axios from "axios";
import { toast } from "sonner";

// Read API key exposed by Vite
const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

const isApiKeyValid = GEMINI_API_KEY.startsWith("AIzaSy");

export const aiService = {
  /**
   * General-purpose Gemini API request sender.
   */
  async generateContent(prompt: string): Promise<string> {
    if (!GEMINI_API_KEY || !isApiKeyValid) {
      throw new Error("INVALID_KEY");
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const candidate = response.data?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Không nhận được kết quả hợp lệ từ Gemini API.");
      }

      return text.trim();
    } catch (error: any) {
      console.error("Gemini API error:", error);
      throw error;
    }
  },


  /**
   * Expands and completes the user's short draft description.
   */
  async polishDescription(currentText: string, context: any, language: string = "vi"): Promise<string> {
    try {
      const contextStr = getContextString(context, language);
      const prompt =
        language === "vi"
          ? `Bạn là trợ lý ảo viết lách thông minh của WanderLab.
Nhiệm vụ của bạn là VIẾT TIẾP và HOÀN THIỆN mô tả chuyến đi từ đoạn mô tả ngắn/ý tưởng sơ khai hiện có của người dùng để tạo nên một bài viết hấp dẫn, trọn vẹn và truyền cảm hứng.

Thông tin chuyến đi (Ngữ cảnh):
${contextStr}

Ý tưởng/Đoạn mô tả ngắn hiện tại của người dùng:
"${currentText}"

Yêu cầu:
1. Giữ nguyên ý chính và phong cách trong ý tưởng hiện tại của người dùng, sau đó viết tiếp để mở rộng, hoàn thiện đoạn mô tả một cách mượt mà và tự nhiên.
2. Độ dài đoạn văn hoàn thiện khoảng 4-5 câu (khoảng 80 - 120 từ).
3. Làm nổi bật điểm độc đáo của địa danh, trải nghiệm và phong cách du lịch được lựa chọn.
4. Chỉ trả về đoạn văn mô tả hoàn thiện trực tiếp. Không thêm lời chào, không giải thích, không bọc trong ngoặc kép.`
          : `You are the smart AI writing assistant of WanderLab.
Your task is to EXPAND and COMPLETE the trip description based on the user's short draft/ideas to make it engaging, coherent, and inspiring.

Trip Info (Context):
${contextStr}

User's current short description/ideas:
"${currentText}"

Requirements:
1. Retain the core meaning and tone of the user's current draft, then continue writing to expand and complete the description smoothly and naturally.
2. The final paragraph length should be about 4-5 sentences (80 - 120 words).
3. Highlight the unique aspect of the destination, activities, and travel style.
4. Return ONLY the completed description paragraph directly. No intro, no explanations, no quotation marks.`;

      return await this.generateContent(prompt);
    } catch (error: any) {
      console.warn("Falling back to local mock expansion due to API error or invalid key:", error.message);
      
      toast.warning(
        language === "vi"
          ? "Đang chạy chế độ thử nghiệm (Mock Mode) do API Key chưa cấu hình hoặc không hợp lệ."
          : "Running in Demo Mode due to missing/invalid Gemini API Key."
      );

      await new Promise(resolve => setTimeout(resolve, 800));
      return getMockPolish(currentText, context, language);
    }
  },

  /**
   * Generates budget and optimal activities suggestions based on trip metadata.
   */
  async generateBudgetAndActivities(context: any, language: string = "vi"): Promise<string> {
    const prompt = language === "vi"
      ? `Bạn là chuyên gia tư vấn du lịch của WanderLab.
Hãy gợi ý ngân sách hàng ngày (bằng VNĐ) và các hoạt động tối ưu cho chuyến đi sau:
- Địa điểm: ${context.location}
- Phong cách du lịch: ${context.style || "Tự do"}
- Số người: ${context.groupSize} người
- Tiêu đề chuyến đi: ${context.title || "Chưa rõ"}

Hãy viết phản hồi cực kỳ ngắn gọn, khoảng 2-3 câu, nêu rõ ngân sách dự kiến mỗi ngày và 2-3 hoạt động nổi bật nhất.`
      : `You are the travel expert of WanderLab.
Suggest daily budget (in VND) and optimal activities for:
- Location: ${context.location}
- Style: ${context.style || "Casual"}
- Group size: ${context.groupSize} people
- Title: ${context.title || "Not set"}

Keep it very short (2-3 sentences), specifying expected daily budget and 2-3 top highlights.`;

    try {
      return await this.generateContent(prompt);
    } catch (error: any) {
      console.warn("Falling back to mock budget suggestions due to API error or invalid key:", error.message);
      
      toast.warning(
        language === "vi"
          ? "Đang chạy chế độ thử nghiệm (Mock Mode) do API Key chưa cấu hình hoặc không hợp lệ."
          : "Running in Demo Mode due to missing/invalid Gemini API Key."
      );

      await new Promise(resolve => setTimeout(resolve, 800));
      return getMockBudgetSuggestions(context.location, context.style || "Tự do", context.groupSize || "1", language);
    }
  }
};

function getContextString(context: any, language: string): string {
  const { title, location, startDate, endDate, budget, groupSize, style } = context || {};
  const duration = startDate && endDate ? `${startDate} đến ${endDate}` : "Chưa rõ";
  
  if (language === "vi") {
    return `- Tiêu đề: ${title || "Chưa đặt"}
- Địa điểm: ${location || "Chưa rõ"}
- Thời gian: ${duration}
- Phong cách: ${style || "Tự do"}
- Ngân sách: ${budget ? budget + " VND" : "Chưa rõ"}
- Số người đi: ${groupSize || 1} người`;
  } else {
    return `- Title: ${title || "Not set"}
- Location: ${location || "Unknown"}
- Duration: ${duration}
- Style: ${style || "Casual"}
- Budget: ${budget ? budget + " VND" : "Unknown"}
- Group Size: ${groupSize || 1} people`;
  }
}

function getMockPolish(currentText: string, context: any, language: string): string {
  const title = context?.title || "Hành trình khám phá";
  const location = context?.location || "điểm đến";
  const style = context?.style || "Tự do";
  const groupSize = context?.groupSize || "1";

  if (language === "vi") {
    return `${currentText || "Hành trình"} khám phá "${title}" tại ${location} sẽ mang lại những trải nghiệm vô cùng độc đáo. Với phong cách du lịch ${style} dành cho nhóm ${groupSize} người, chuyến đi sẽ đưa chúng ta qua những cung đường tuyệt đẹp, hòa mình vào cuộc sống văn hóa bản địa và thưởng thức ẩm thực đặc trưng. Đây chắc chắn là hành trình đáng nhớ đầy cảm hứng!`;
  } else {
    return `${currentText || "Our journey"} to discover "${title}" in ${location} is bound to be an incredible experience. Experiencing a ${style} trip with ${groupSize} traveler(s), we will enjoy a perfect blend of adventure, local culture, and stunning scenery, making memories that last a lifetime.`;
  }
}

function getMockBudgetSuggestions(location: string, style: string, groupSize: string, language: string): string {
  if (language === "vi") {
    return `Dự kiến chi phí khoảng 800.000 - 1.500.000đ/ngày/người cho chuyến đi ${style} tại ${location}.
Hoạt động nổi bật:
1. Trải nghiệm khám phá các cung đường và địa danh nổi tiếng ở ${location}.
2. Thưởng thức ẩm thực đường phố và đặc sản vùng miền đặc sắc cùng nhóm ${groupSize} người.
3. Check-in những góc ảnh đẹp nhất để lưu lại dấu ấn hành trình.`;
  } else {
    return `Estimated budget: 800,000 - 1,500,000 VND/day/person for a ${style} trip in ${location}.
Highlights:
1. Explore top-rated local landmarks and trails in ${location}.
2. Enjoy signature local food and dishes with your group of ${groupSize}.
3. Take pictures at the best photography spots.`;
  }
}
