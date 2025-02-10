import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";

const zodSchema = zod
    .object({
        password: zod
            .string()
            .min(6, "Password must be at least 6 characters long."),
        repeatPassword: zod.string(),
        token: zod.string(),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "Passwords do not match.",
        path: ["repeatPassword"],
    });

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();

        const validationResult = zodSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: validationResult.error.errors[0],
                    message: validationResult.error.errors[0].message,
                },
                { status: 400 }
            );
        }

        const { password, token } = validationResult.data;

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: "user",
                    message: "Forgot password token must have expired.",
                },
                { status: 500 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiration = undefined;

        await user.save();

        return NextResponse.json(
            { message: "Password updated successfully." },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error, message: error.message });
    }
}
