import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import zod from "zod";
import { connectDb } from "@/dbConfig/dbConfig";
import bcrypt from "bcryptjs";

const zodSchema = zod
    .object({
        password: zod
            .string()
            .min(6, "Password must be at least six characters long."),
        confirmPassword: zod.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
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
                {
                    status: 400,
                }
            );
        }

        const { password } = validationResult.data;

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
                    status: 404,
                }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Updated password successfully",
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: "server",
                message: "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}
