import { NextRequest, NextResponse } from "next/server";
import Question from "@/models/questionModel";
import { connectDb } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const questionID = url.searchParams.get("questionID");
        console.log(questionID);

        await connectDb();

        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json(
                {
                    error: "user",
                    message: "No user token found.",
                },
                { status: 401 }
            );
        }

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
                { status: 404 }
            );
        }

        const existingVoteIndex = question.votes.findIndex(
            (vote: any) => vote.user.toString() === userId
        );

        let existingVote: any = {};

        if (existingVoteIndex >= 0) {
            existingVote = question.votes[existingVoteIndex];
        }

        return NextResponse.json({
            success: true,
            question: question,
            userVoteType: existingVote.voteType || undefined,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "question", message: "Error getting the question." },
            { status: 500 }
        );
    }
}
