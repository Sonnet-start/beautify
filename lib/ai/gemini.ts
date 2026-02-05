import { generateText } from "ai";
import { createGeminiProvider } from "ai-sdk-provider-gemini-cli";

// Initialize the Gemini provider with OAuth (subscription-based)
const gemini = createGeminiProvider({
  authType: "oauth-personal",
});

const MODEL_ID = "gemini-3-flash-preview";

// System prompt for the cosmetology AI assistant
const SYSTEM_PROMPT = `Ты — профессиональный AI-косметолог с многолетним опытом. 
Твоя задача — давать персонализированные рекомендации по уходу за кожей лица.

Следуй этим правилам:
1. Всегда отвечай на русском языке
2. Учитывай тип кожи, возраст и проблемы пользователя
3. Рекомендуй только безопасные и проверенные методы
4. Предупреждай о возможных противопоказаниях
5. Структурируй ответы: сначала анализ, потом рекомендации
6. Используй эмодзи для лучшего восприятия
7. Если не уверен — рекомендуй обратиться к дерматологу
8. Не рекомендуй конкретные бренды, только типы средств

Формат ответа:
- Краткий анализ ситуации
- 3-5 конкретных рекомендаций
- Порядок применения средств (утро/вечер)
- Предупреждения (если есть)`;

export interface UserProfile {
  name?: string;
  age?: string;
  skinType?: string;
  problems?: string[];
  allergies?: string;
  goals?: string;
}

export function formatUserContext(profile: UserProfile): string {
  const parts: string[] = [];

  if (profile.name) parts.push(`Имя: ${profile.name}`);
  if (profile.age) parts.push(`Возраст: ${profile.age}`);
  if (profile.skinType) parts.push(`Тип кожи: ${profile.skinType}`);
  if (profile.problems?.length) parts.push(`Проблемы: ${profile.problems.join(", ")}`);
  if (profile.allergies) parts.push(`Аллергии: ${profile.allergies}`);
  if (profile.goals) parts.push(`Цели: ${profile.goals}`);

  return parts.length > 0 ? `Профиль пользователя:\n${parts.join("\n")}` : "";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateRecommendation(
  userMessage: string,
  userProfile?: UserProfile,
  conversationHistory?: ChatMessage[]
) {
  const userContext = userProfile ? formatUserContext(userProfile) : "";

  // Map history to SDK format
  const messages = (conversationHistory || []).map((msg) => ({
    role: msg.role === "assistant" ? ("assistant" as const) : ("user" as const),
    content: msg.content,
  }));

  // Add current message with context if first message
  const contextualMessage =
    messages.length === 0 && userContext ? `${userContext}\n\nВопрос: ${userMessage}` : userMessage;

  const { text } = await generateText({
    model: gemini(MODEL_ID),
    system: SYSTEM_PROMPT,
    messages: [...messages, { role: "user", content: contextualMessage }],
    temperature: 0.7,
  });

  return {
    text,
    history: [
      ...messages,
      { role: "user", content: contextualMessage },
      { role: "assistant", content: text },
    ],
  };
}

export async function analyzeImage(
  imageBase64: string,
  mimeType: string,
  userProfile?: UserProfile
) {
  const userContext = userProfile ? formatUserContext(userProfile) : "";
  const normalizedImage = imageBase64.startsWith("data:")
    ? (imageBase64.split(",")[1] ?? imageBase64)
    : imageBase64;

  const prompt = `${userContext}

Проанализируй это фото кожи лица. Определи:
1. Общее состояние кожи
2. Видимые проблемы (расширенные поры, акне, пигментация и т.д.)
3. Тип кожи (если возможно определить)
4. Рекомендации по уходу

Будь деликатен в формулировках и подчеркни положительные аспекты.`;

  const { text } = await generateText({
    model: gemini(MODEL_ID),
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image", image: normalizedImage, mediaType: mimeType },
        ],
      },
    ],
  });

  return text;
}
