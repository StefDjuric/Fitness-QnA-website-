import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Question from "@/models/questionModel";
import Answer from "@/models/answerModel";

export async function DELETE(request: NextRequest) {
    try {
        await connectDb();

        const userID = await getDataFromToken(request);

        const user = await User.findByIdAndDelete(userID);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "user",
                    message: "User could not be deleted.",
                },
                {
                    status: 500,
                }
            );
        }

        const questions = await Question.deleteMany({ owner: userID });
        const answers = await Answer.deleteMany({ owner: userID });

        const response = NextResponse.json(
            {
                success: true,
                message: "Successfully deleted your profile.",
            },
            {
                status: 202,
            }
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        response.cookies.set("next-auth.session-token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: "server",
                message: "Internal server error.",
            },
            { status: 500 }
        );
    }
}
