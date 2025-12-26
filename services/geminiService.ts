
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], chatName: string) => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `You are simulating the behavior of a REAL person on WeChat Social (微信) named "${chatName}". 
        - If the name is "文件传输助手", reply as a system utility (brief, functional).
        - If the name is a person (like "张经理"), adopt their persona. Be professional and helpful.
        - Your goal is to make the user believe this is a real-time bridge to a real WeChat contact.
        - Respond in Chinese (simplified) unless the user speaks another language.
        - Use WeChat-style emojis (like [微笑], [呲牙], [好的]).
        - Keep messages short and conversational.`,
      }
    });

    return response.text || "网关超时，请稍后重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "系统消息: 无法建立加密连接，请检查网络设置。";
  }
};

export const generateTTS = async (text: string, voiceName: 'Kore' | 'Puck' | 'Zephyr' = 'Kore') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say naturally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
