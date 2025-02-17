import { connectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectDb();

        const reqBody = await request.json();

        const { emailOrUsername, password } = reqBody;

        // Validation
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: "emailOrUsername",
                    message: "Invalid email or username.",
                },
                { status: 401 }
            );
        }

        const passwordValid: boolean = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordValid) {
            return NextResponse.json(
                {
                    error: "password",
                    message: "Password is not correct.",
                },
                { status: 401 }
            );
        }

        // Creating token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: "1d",
        });

        const response = NextResponse.json({
            message: "Login successfull",
            success: true,
        });

        response.cookies.set("token", token, { httpOnly: true });
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
