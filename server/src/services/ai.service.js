import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a helpful, friendly, and intelligent AI assistant. You provide clear, accurate, and concise responses. When writing code, always use proper formatting with code blocks and specify the programming language. You can help with a wide range of topics including coding, writing, analysis, math, and general knowledge. Be conversational and engaging while remaining professional.`;

export const generateStreamingResponse = async (messages, onToken, onComplete, onError) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage.content);

    let fullResponse = "";

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullResponse += text;
        onToken(text);
      }
    }

    onComplete(fullResponse);
  } catch (error) {
    console.error("Gemini API error:", error);
    onError(error.message || "AI service error");
  }
};

export const generateTitle = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Generate a short, concise title (max 6 words, no quotes) for a chat conversation that starts with this message: "${userMessage}"`
    );
    return result.response.text().trim().replace(/^["']|["']$/g, "");
  } catch {
    return "New Chat";
  }
};
