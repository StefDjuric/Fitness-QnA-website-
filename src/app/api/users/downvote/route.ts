import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Question from "@/models/questionModel";
import { connectDb } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const requestBody = await request.json();

        const { questionID } = requestBody;

        if (!questionID) {
            return NextResponse.json(
                { error: "question", message: "No questionID found!" },
                { status: 404 }
            );
        }

        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: "user", message: "No user token found!" },
                { status: 401 }
            );
        }

        const question = await Question.findById(questionID);

        if (!question) {
            return NextResponse.json(
                { error: "question", message: "No question found." },
                { status: 404 }
            );
        }

        const existingVoteIndex = question.votes.findIndex(
            (vote: any) => vote.user.toString() === userId
        );

        let netVoteChange = 0;

        if (existingVoteIndex >= 0) {
            const existingVote = question.votes[existingVoteIndex];

            if (existingVote.voteType === -1) {
                question.votes.splice(existingVoteIndex, 1);
                netVoteChange = 1;
            } else {
                const previousVoteType = existingVote.voteType;
                existingVote.voteType = -1;
                netVoteChange = -1 - previousVoteType;
            }
        } else {
            question.votes.push({ user: userId, voteType: Number(-1) });
            netVoteChange = -1;
        }

        question.upvotes += netVoteChange;

        await question.save();

        const currentVote = question.votes.find(
            (vote: any) => vote.user.toString() === userId
        );
        const userVoteType = currentVote ? currentVote.voteType : 0;

        return NextResponse.json({
            message: "Successfully downwoted.",
            updatedUpvotes: question.upvotes,
            userVoteType: userVoteType,
        });
    } catch (error: any) {
        return NextResponse.json({
            error: "server",
            message: "Internal server error.",
        });
    }
}
