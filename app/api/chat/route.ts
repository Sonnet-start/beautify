import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRecommendation, analyzeImage, type UserProfile } from "@/lib/ai/gemini";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { message, image, history } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Сообщение обязательно" },
                { status: 400 }
            );
        }

        // Get user profile from metadata
        const userProfile: UserProfile = {
            name: user.user_metadata?.name,
            age: user.user_metadata?.age,
            skinType: user.user_metadata?.skin_type,
            problems: user.user_metadata?.skin_problems,
            allergies: user.user_metadata?.allergies,
            goals: user.user_metadata?.goals,
        };

        // Generate AI response
        let result;

        if (image) {
            // Extract mimeType from base64 data URL
            const mimeMatch = image.match(/data:(.*?);base64/);
            const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

            const analysisText = await analyzeImage(image, mimeType, userProfile);
            result = {
                text: analysisText,
                history: [
                    ...(history || []),
                    { role: "user", content: message },
                    { role: "assistant", content: analysisText },
                ],
            };
        } else {
            result = await generateRecommendation(message, userProfile, history);
        }

        return NextResponse.json({
            response: result.text,
            history: result.history,
        });
    } catch (error) {
        console.error("AI Chat Error:", error);

        // Return more detailed error for debugging
        const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
