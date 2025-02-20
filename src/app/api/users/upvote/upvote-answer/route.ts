import { NextRequest, NextResponse } from "next/server";
import Answer from "@/models/answerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDb } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const requestBody = await request.json();

        const { answerID } = requestBody;

        if (!answerID) {
            return NextResponse.json(
                { error: "question", message: "Could not get answer ID." },
                { status: 404 }
            );
        }

        const answer = await Answer.findById(answerID);

        if (!answer) {
            return NextResponse.json(
                { error: "question", message: "Answer could not be found." },
                { status: 500 }
            );
        }

        const userID = await getDataFromToken(request);

        if (!userID) {
            return NextResponse.json(
                { error: "user", message: "User id could not be found." },
                { status: 401 }
            );
        }

        const existingVoteIndex = answer.votes.findIndex(
            (vote: any) => vote.user.toString() === userID
        );

        let netVoteChange = 0;

        if (existingVoteIndex >= 0) {
            const existingVote = answer.votes[existingVoteIndex];

            if (existingVote.voteType === 1) {
                answer.votes.splice(existingVoteIndex, 1);
                netVoteChange = -1;
            } else {
                const previousVoteType = existingVote.voteType;
                existingVote.voteType = 1;
                netVoteChange = 1 - previousVoteType;
            }
        } else {
            answer.votes.push({ user: userID, voteType: Number(1) });
            netVoteChange = 1;
        }

        answer.upvotes += netVoteChange;

        await answer.save();

        const currentVote = answer.votes.find(
            (vote: any) => vote.user.toString() === userID
        );

        const userAnswerVoteType = currentVote ? currentVote.voteType : 0;

        return NextResponse.json({
            message: "Successfully upvoted.",
            updatedUpvotes: answer.upvotes,
            userAnswerVoteType: userAnswerVoteType,
        });
    } catch (error: any) {
        return NextResponse.json({
            error: "server",
            message: "Internal server error.",
        });
    }
}
