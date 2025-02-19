import { NextRequest, NextResponse } from "next/server";
import Question from "@/models/questionModel";
import { connectDb } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Questions from "@/app/questions/page";

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json(
                {
                    error: "server",
                    message: "No user id found",
                },
                {
                    status: 401,
                }
            );
        }

        const { questionID } = await request.json();

        if (!questionID) {
            return NextResponse.json(
                {
                    error: "question",
                    message: "Question id is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const question = await Question.findById(questionID);

        if (!question) {
            return NextResponse.json(
                {
                    error: "question",
                    message: "No question found!",
                },
                {
                    status: 404,
                }
            );
        }

        const existingVoteIndex = question.votes.findIndex(
            (vote: any) => vote.user.toString() === userId
        );

        let netVoteChange = 0;

        // if upvote exists
        if (existingVoteIndex >= 0) {
            const existingVote = question.votes[existingVoteIndex];

            // if upvoted
            if (existingVote.voteType === 1) {
                question.votes.splice(existingVoteIndex, 1);
                netVoteChange = -1;
            }
            // if downwoted
            else {
                const previousVoteType = existingVote.voteType;
                existingVote.voteType = 1;
                netVoteChange = 1 - previousVoteType;
            }
        } else {
            question.votes.push({ user: userId, voteType: Number(1) });
            netVoteChange = 1;
        }

        question.upvotes += netVoteChange;

        await question.save();

        const currentVote = question.votes.find(
            (vote: any) => vote.user.toString() === userId
        );
        const userVoteType = currentVote ? currentVote.voteType : 0;

        return NextResponse.json({
            success: true,
            message: "Successfully upvoted.",
            updatedUpvotes: question.upvotes,
            userVoteType: userVoteType,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "server",
                message: "Failed to upvote.",
            },
            { status: 500 }
        );
    }
}
