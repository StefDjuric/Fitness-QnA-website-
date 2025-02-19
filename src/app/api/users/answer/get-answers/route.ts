import { NextRequest, NextResponse } from "next/server";
import Answer from "@/models/answerModel";
import { connectDb } from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const questionID = url.searchParams.get("questionID");

        await connectDb();

        const answers = await Answer.find({
            questionAnsweredOn: questionID,
        }).populate("owner", "username");

        if (answers.length === 0) {
            return NextResponse.json(
                {
                    error: "question",
                    message: "No answers found for this question.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            answers: answers,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "server",
                message: "Unable to get answers for this question!",
            },
            {
                status: 500,
            }
        );
    }
}
