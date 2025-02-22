import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDb } from "@/dbConfig/dbConfig";
import zod from "zod";
import { sendEmail } from "@/helpers/mailer";

const zodSchema = zod.object({
    email: zod.string().email("Invalid email address."),
});

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const requestBody = await request.json();

        const validationResult = zodSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationResult.error.errors[0],
                    message: validationResult.error.errors[0].message,
                },
                { status: 400 }
            );
        }

        const { email } = validationResult.data;

        const userID = await getDataFromToken(request);

        if (!userID) {
            return NextResponse.json(
                {
                    error: "user",
                    message: "No user token found.",
                    success: false,
                },
                {
                    status: 401,
                }
            );
        }

        const user = await User.findById(userID);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "user",
                    message: "No user found.",
                },
                {
                    status: 500,
                }
            );
        }

        user.email = email;
        user.isVerified = false;

        const savedUser = await user.save();

        const response = NextResponse.json(
            {
                success: true,
                message: "Updated email successfully",
            },
            {
                status: 200,
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

        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

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
