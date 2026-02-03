import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
    console.error("❌ ОШИБКА: GOOGLE_AI_API_KEY не найден в переменных окружения.");
    process.exit(1);
}

console.log("🔑 API Key найден:", apiKey.slice(0, 5) + "...");

async function testConnection() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("📡 Отправка тестового запроса к gemini-1.5-flash...");
        const result = await model.generateContent("Привет! Ответь одним словом: Работает.");
        const response = await result.response;
        const text = response.text();

        console.log("✅ УСПЕХ: Ответ модели:", text);
    } catch (error) {
        console.error("❌ ОШИБКА ПОДКЛЮЧЕНИЯ:", error);
    }
}

testConnection();
