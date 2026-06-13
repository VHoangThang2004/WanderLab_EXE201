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
   * Refines/polishes the user's draft description, or generates a complete one.
   */
  async polishDescription(currentText: string, context: any, language: string = "vi"): Promise<string> {
    try {
      const contextStr = getContextString(context, language);
      const prompt =
        language === "vi"
          ? `Bạn là trợ lý ảo viết lách thông minh của WanderLab.
Nhiệm vụ của bạn là ĐÁNH BÓNG và HOÀN THIỆN mô tả chuyến đi dựa trên ý tưởng sơ khai hoặc nội dung hiện tại của người dùng.

Thông tin chuyến đi (Ngữ cảnh):
${contextStr}

Nội dung/Ý tưởng thô của người dùng:
"${currentText || "(Chưa nhập ý tưởng, hãy tự động tạo mô tả hoàn chỉnh hấp dẫn dựa trên thông tin chuyến đi phía trên)"}"

Yêu cầu:
1. Viết một đoạn văn mô tả hoàn chỉnh, hấp dẫn, chau chuốt và truyền cảm hứng.
2. Độ dài khoảng 3-4 câu (dưới 100 từ).
3. Làm nổi bật điểm độc đáo của địa danh và phong cách du lịch được lựa chọn.
4. Chỉ trả về đoạn văn mô tả trực tiếp. Không thêm lời chào, không giải thích, không bọc trong ngoặc kép.`
          : `You are the smart AI writing assistant of WanderLab.
Your task is to POLISH and COMPLETE the trip description based on the user's raw thoughts or existing content.

Trip Info (Context):
${contextStr}

User's raw thoughts/content:
"${currentText || "(Empty thoughts, please generate a complete engaging description based on the trip info above)"}"

Requirements:
1. Write a complete, inspiring, and polished trip description paragraph.
2. Length should be about 3-4 sentences (under 100 words).
3. Emphasize the highlight of the destination and the travel style.
4. Return ONLY the polished description text directly. No intro, no explanations, no quotation marks.`;

      return await this.generateContent(prompt);
    } catch (error: any) {
      console.warn("Falling back to local mock polish due to API error or invalid key:", error.message);
      
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
    const rawIdea = currentText ? `Dựa trên ý tưởng "${currentText}", hành` : "Hành";
    return `${rawIdea} trình khám phá "${title}" tại ${location} hứa hẹn mang lại những trải nghiệm vô cùng độc đáo. Với phong cách du lịch ${style} dành cho nhóm ${groupSize} người, chuyến đi sẽ đưa bạn qua những cung đường tuyệt đẹp, hòa mình vào cuộc sống văn hóa bản địa và thưởng thức ẩm thực đặc trưng. Đây chắc chắn là chuyến đi đáng nhớ giúp tái tạo năng lượng hiệu quả.`;
  } else {
    const rawIdea = currentText ? `Based on "${currentText}", this` : "This";
    return `${rawIdea} trip "${title}" to ${location} is designed to be an incredible experience. Tailored as a ${style} journey for ${groupSize} person(s), it offers a blend of adventure, local culture, and stunning views. It will be the perfect escape to unwind and create lifelong memories.`;
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
