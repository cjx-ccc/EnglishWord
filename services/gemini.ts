
import { GoogleGenAI } from "@google/genai";
import { Word } from "../types";

export const generateMnemonicStory = async (words: Word[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const wordListStr = words.map(w => `${w.word} (${w.meaning})`).join(', ');
  
  const prompt = `
    请为以下这5个英语单词创作一个简短、有趣且容易记住的小故事。
    单词列表：${wordListStr}
    
    要求：
    1. 故事长度在150字以内。
    2. 故事内容要连贯，自然地包含这5个单词。
    3. 每个重点单词出现时，请加粗显示，并附带中文意思，例如：**ability (能力)**。
    4. 故事结尾加一句简短的总结或者口诀帮助记忆。
    5. 使用中文书写。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "AI 无法生成故事，请重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "生成故事时出错，请检查网络连接。";
  }
};
