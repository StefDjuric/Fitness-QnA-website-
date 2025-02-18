import { NextRequest, NextResponse } from "next/server";
import Question from "@/models/questionModel";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const questionID = url.searchParams.get("questionID");
        console.log(questionID);

        const question = await Question.findById(questionID).populate(
            "owner",
            "username"
        );

        if (!question) {
            return NextResponse.json(
                {
                    error: "question",
                    message: "Error finding the question by id.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, question: question });
    } catch (error: any) {
        return NextResponse.json(
            { error: "question", message: "Error getting the question." },
            { status: 500 }
        );
    }
}
