
import { GoogleGenAI } from "@google/genai";

export const generateEventSummary = async (prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "";
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw error;
  }
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const chatWithGemini = async (history: ChatMessage[], message: string, context: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Transform history to Gemini format
    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Add the new message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: `Bạn là trợ lý AI hữu ích cho trang web "NHÓM THÂN HỬU PHÚ NHỰAN". 
        Nhiệm vụ của bạn là giải đáp thắc mắc của thành viên về lịch sử nhóm, các sự kiện, và thông tin chung.
        Dưới đây là thông tin ngữ cảnh về nhóm hiện tại:
        ${context}
        
        Hãy trả lời ngắn gọn, thân thiện và lịch sự bằng tiếng Việt.`,
      }
    });

    return response.text || "Xin lỗi, tôi không thể trả lời ngay lúc này.";
  } catch (error) {
    console.error("Error chatting with Gemini API:", error);
    return "Đã xảy ra lỗi khi kết nối với AI.";
  }
};
