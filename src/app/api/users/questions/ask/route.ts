import { NextResponse, NextRequest } from "next/server";
import Question from "@/models/questionModel";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import zod from "zod";

const zodSchema = zod.object({
    title: zod
        .string()
        .min(5, "Title should be at least five characters long."),
    description: zod
        .string()
        .min(20, "Problem description should be at least 20 characters long."),
});

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();

        const validationResult = zodSchema.safeParse(requestBody);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: validationResult.error.errors[0],
                    message: validationResult.error.errors[0].message,
                },
                { status: 400 }
            );
        }

        const { title, description } = validationResult.data;

        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: "userId", message: "No id found." },
                { status: 401 }
            );
        }

        await connectDb();

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                {
                    error: "user",
                    message: "No user found with userId.",
                },
                {
                    status: 400,
                }
            );
        }

        const newQuestion = await new Question({
            title: title,
            content: description,
            owner: userId,
        });

        const savedQuestion = await newQuestion.save();

        await user.userQuestions.push(savedQuestion._id);

        await user.save();

        return NextResponse.json({
            message: "Question created successfully.",
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
