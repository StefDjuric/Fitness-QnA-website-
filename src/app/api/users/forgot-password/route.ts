import zod from "zod";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import { connectDb } from "@/dbConfig/dbConfig";

const zodSchema = zod.object({
    email: zod.string().email("Invalid email adress."),
});

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const requestBody = await request.json();

        const validationResult = zodSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "email",
                    message: validationResult.error.errors[0].message,
                },
                {
                    status: 400,
                }
            );
        }

        const { email } = validationResult.data;

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    error: "email",
                    message: "User with this email does not exist.",
                },
                { status: 400 }
            );
        }

        await sendEmail({
            email: user.email,
            emailType: "RESET",
            userId: user._id,
        });

        return NextResponse.json({
            message: `Mail sent successfully to ${user.email}`,
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "Database error while sending email",
                message: error.message,
            },
            { status: 500 }
        );
    }
}
