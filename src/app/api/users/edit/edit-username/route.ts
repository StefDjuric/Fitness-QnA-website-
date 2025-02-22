import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import zod from "zod";
import { getDataFromToken } from "@/helpers/getDataFromToken";

const zodSchema = zod.object({
    username: zod
        .string()
        .min(3, "Username must be at least three characters long."),
});

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const requestBody = await request.json();
        const validationResult = zodSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: validationResult.error.errors[0],
                    message: validationResult.error.errors[0].message,
                    success: false,
                },
                {
                    status: 500,
                }
            );
        }

        const { username } = validationResult.data;

        if (await User.findOne({ username })) {
            return NextResponse.json(
                {
                    error: "username",
                    message: "User with the same username already exists.",
                },
                { status: 400 }
            );
        }

        const userID = await getDataFromToken(request);

        const user = await User.findById(userID);

        if (!user) {
            return NextResponse.json(
                {
                    error: "username",
                    message: "No user token was found.",
                    success: false,
                },
                {
                    status: 401,
                }
            );
        }

        user.username = username;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Username successfully updated",
        });
    } catch (error: any) {}
}
