import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeImage, type UserProfile } from "@/lib/ai/gemini";

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

        const formData = await request.formData();
        const file = formData.get("image") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "Изображение обязательно" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Поддерживаются только JPEG, PNG и WebP" },
                { status: 400 }
            );
        }

        // Convert to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");

        // Get user profile from metadata
        const userProfile: UserProfile = {
            name: user.user_metadata?.name,
            age: user.user_metadata?.age,
            skinType: user.user_metadata?.skin_type,
            problems: user.user_metadata?.skin_problems,
            allergies: user.user_metadata?.allergies,
            goals: user.user_metadata?.goals,
        };

        // Analyze image with Gemini Vision
        const analysis = await analyzeImage(base64, file.type, userProfile);

        return NextResponse.json({
            analysis,
        });
    } catch (error) {
        console.error("Vision Analysis Error:", error);
        return NextResponse.json(
            { error: "Ошибка при анализе изображения" },
            { status: 500 }
        );
    }
}
