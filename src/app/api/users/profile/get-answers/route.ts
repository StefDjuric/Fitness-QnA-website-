import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export async function GET(request: NextRequest) {
    try {
        await connectDb();

        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json(
                {
                    error: "user",
                    message: "No user token found",
                },
                {
                    status: 401,
                }
            );
        }

        const user = await User.findById(userId).populate({
            path: "userAnswers",
            model: "Answer",
            populate: {
                path: "questionAnsweredOn",
                model: "Question",
                select: "_id title",
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: "user",
                    message: "No user found.",
                },
                {
                    status: 500,
                }
            );
        }

        const userAnswers = user.userAnswers;

        return NextResponse.json(
            {
                success: true,
                userAnswers: userAnswers,
                username: user.username,
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "server",
                message: "Internal server error.",
                success: false,
            },
            {
                status: 500,
            }
        );
    }
}
