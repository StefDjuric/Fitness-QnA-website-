import { connectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel.js";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { sendEmail } from "@/helpers/mailer";

const zodUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long."),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectDb();
        const reqBody = await request.json();

        // Validate request body
        const validationResult = zodUserSchema.safeParse(reqBody);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: validationResult.error.errors[0],
                    message: validationResult.error.errors[0].message,
                },
                { status: 400 }
            );
        }

        const { username, password, email } = validationResult.data;

        console.log(validationResult.data);

        if (await User.findOne({ email })) {
            return NextResponse.json(
                {
                    error: "email",
                    message: "User with this email already exists",
                },
                { status: 400 }
            );
        }
        if (await User.findOne({ username })) {
            return NextResponse.json(
                {
                    error: "username",
                    message: "User with the same username already exists.",
                },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email,
        });

        const savedUser = await newUser.save();

        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
