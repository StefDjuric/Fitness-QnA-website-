import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDb();
        const requestBody = await request.json();
        const { token } = requestBody;

        console.log(token);

        if (!token) {
            return NextResponse.json(
                { error: "token", message: "No token found." },
                { status: 500 }
            );
        }

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "user", message: "No user with that token found." },
                { status: 500 }
            );
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiration = undefined;

        await user.save();

        return NextResponse.json(
            { message: "Email verified successfully." },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "Verify",
                message: "Error while verifying email",
            },
            {
                status: 500,
            }
        );
    }
}
