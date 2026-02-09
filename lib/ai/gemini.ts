import { generateText } from "ai";
import { createGeminiProvider } from "ai-sdk-provider-gemini-cli";

// Initialize the Gemini provider with OAuth (subscription-based)
const gemini = createGeminiProvider({
  authType: "oauth-personal",
});

const MODEL_ID = "gemini-3-flash-preview";

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];

type GenerateTextParams = Parameters<typeof generateText>[0];

async function generateTextWithRetry(params: GenerateTextParams) {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await generateText(params);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAYS[attempt];
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Не удалось получить ответ от ИИ после ${MAX_RETRIES} попыток. Последняя ошибка: ${lastError?.message || "Неизвестная ошибка"}. Пожалуйста, попробуйте позже.`
  );
}

// System prompt for the cosmetology AI assistant
const SYSTEM_PROMPT = `Ты — профессиональный ИИ-ассистент в области косметологии и ухода за кожей.
Твоя задача — давать персонализированные рекомендации по домашнему уходу за кожей лица.

ВАЖНОЕ ПРАВИЛО БЕЗОПАСНОСТИ:
Ты НЕ имеешь права ставить медицинские диагнозы, назначать лечение, выписывать лекарственные препараты или комментировать родинки, новообразования, раны и серьезные дерматологические заболевания (экзема, псориаз, розацеа в острой стадии, сильное акне III-IV степени).

Если пользователь спрашивает о медицинских симптомах, просит поставить диагноз или присылает фото с явными признаками заболевания:
1. Мягко откажись от конкретных рекомендаций по лечению.
2. Настойчиво порекомендуй обратиться к врачу-дерматологу.
3. Используй фразу: "Я не являюсь врачом и не могу ставить диагнозы. Пожалуйста, обратитесь к специалисту для очной консультации."

В остальных случаях всегда учитывай:
1. Тип кожи клиента (если указан)
2. Возраст, если известен
3. Указанные проблемы кожи
4. Противопоказания и аллергии (если указаны)
5. Актуальные тренды: корейский уход, мягкое очищение, barrier repair
6. Доступные средства для разных бюджетов (масс-маркет, аптека, люкс)
7. Если не знаешь — честно признай это
8. Не рекомендуй инвазивные процедуры

Формат ответа:
- Краткий анализ ситуации (дружелюбный тон)
- 3-5 конкретных рекомендаций (этапы ухода)
- Порядок применения средств (утро/вечер)
- Важные предупреждения (например, про SPF или тест на аллергию)`;

export interface UserProfile {
  name?: string;
  age?: string;
  skinType?: string;
  problems?: string[];
  allergies?: string;
  goals?: string[];
}

export function formatUserContext(profile: UserProfile): string {
  const parts: string[] = [];

  if (profile.name) parts.push(`Имя: ${profile.name}`);
  if (profile.age) parts.push(`Возраст: ${profile.age}`);
  if (profile.skinType) parts.push(`Тип кожи: ${profile.skinType}`);
  if (profile.problems?.length) parts.push(`Проблемы: ${profile.problems.join(", ")}`);
  if (profile.allergies) parts.push(`Аллергии: ${profile.allergies}`);
  if (profile.goals?.length) parts.push(`Цели: ${profile.goals.join(", ")}`);

  return parts.length > 0 ? `Профиль пользователя:\n${parts.join("\n")}` : "";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MEDICAL_STOP_WORDS = [
  "меланома",
  "рак кожи",
  "базалиома",
  "карцинома",
  "гнойная рана",
  "кровоточит",
  "сифилис",
  "лепроз",
];

const MEDICAL_DISCLAIMER_RESPONSE = `К сожалению, я не могу проконсультировать вас по этому вопросу. 

Ваш запрос содержит упоминание серьезных медицинских состояний или симптомов, требующих немедленного обращения к врачу. 

Пожалуйста, обратитесь к дерматологу или онкологу для профессиональной диагностики и лечения. Я — искусственный интеллект и не имею права давать рекомендации в таких случаях.`;

export async function generateRecommendation(
  userMessage: string,
  userProfile?: UserProfile,
  conversationHistory?: ChatMessage[]
) {
  // 1. Guardrail for medical stop words
  const lowerMessage = userMessage.toLowerCase();
  if (MEDICAL_STOP_WORDS.some((word) => lowerMessage.includes(word))) {
    return {
      text: MEDICAL_DISCLAIMER_RESPONSE,
      history: [
        ...(conversationHistory || []),
        { role: "user" as const, content: userMessage },
        { role: "assistant" as const, content: MEDICAL_DISCLAIMER_RESPONSE },
      ],
    };
  }

  const userContext = userProfile ? formatUserContext(userProfile) : "";
  const dynamicSystemPrompt = userContext ? `${SYSTEM_PROMPT}\n\n${userContext}` : SYSTEM_PROMPT;

  // Map history to SDK format
  const messages = (conversationHistory || []).map((msg) => ({
    role: msg.role === "assistant" ? ("assistant" as const) : ("user" as const),
    content: msg.content,
  }));

  const { text } = await generateTextWithRetry({
    model: gemini(MODEL_ID),
    system: dynamicSystemPrompt,
    messages: [...messages, { role: "user", content: userMessage }],
    temperature: 0.7,
  });

  return {
    text,
    history: [
      ...messages,
      { role: "user", content: userMessage },
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

  const dynamicSystemPrompt = userContext ? `${SYSTEM_PROMPT}\n\n${userContext}` : SYSTEM_PROMPT;

  const prompt = `Проанализируй это фото кожи лица. Определи:
1. Общее состояние кожи
2. Видимые проблемы (расширенные поры, акне, пигментация и т.д.)
3. Тип кожи (если возможно определить)
4. Рекомендации по уходу

Будь объективен и конструктивен в своих рекомендациях.`;

  const { text } = await generateTextWithRetry({
    model: gemini(MODEL_ID),
    system: dynamicSystemPrompt,
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
