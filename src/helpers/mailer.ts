import nodemailer, { SentMessageInfo } from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

type EmailProps = {
    email: string;
    emailType: "VERIFY" | "RESET";
    userId: string;
};

export const sendEmail = async ({ email, emailType, userId }: EmailProps) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(
                userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiration: Date.now() + 2400000,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(
                userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiration: Date.now() + 2400000,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });

        const mailOptions = {
            from: "belean.public@gmail.com",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email"
                    : "Reset your password",
            html: `<h1>BeLean.</h1>
            <p>Click <a href="${
                process.env.DOMAIN
            }/verify-email?token=${hashedToken}">here</a> to ${
                emailType === "VERIFY"
                    ? "verify your email"
                    : "reset your password"
            }</p>`,
        };

        const mailResponse = transporter.sendMail(mailOptions);

        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
