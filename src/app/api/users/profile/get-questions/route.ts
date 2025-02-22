import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDb } from "@/dbConfig/dbConfig";

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
            path: "userQuestions",
            model: "Question",
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

        const userQuestions = user.userQuestions;

        return NextResponse.json(
            {
                success: true,
                userQuestions: userQuestions,
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
            },
            {
                status: 500,
            }
        );
    }
}
