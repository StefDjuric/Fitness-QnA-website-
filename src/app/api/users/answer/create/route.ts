import { NextRequest, NextResponse } from "next/server";
import Question from "@/models/questionModel";
import Answer from "@/models/answerModel";
import User from "@/models/userModel";
import zod from "zod";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDb } from "@/dbConfig/dbConfig";

const zodSchema = zod.object({
    textValue: zod.string(),
    questionID: zod.string(),
});

export async function POST(request: NextRequest) {
    try {
        await connectDb();

        const requestBody = await request.json();

        const validationResult = zodSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return NextResponse.json({
                error: validationResult.error.errors[0],
                message: validationResult.error.errors[0].message,
            });
        }

        const { textValue, questionID } = validationResult.data;

        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: "userID", message: "No user token found!" },
                { status: 401 }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { error: "user", message: "No user with that id found." },
                { status: 500 }
            );
        }

        const newAnswer = await new Answer({
            content: textValue,
            owner: userId,
            questionAnsweredOn: questionID,
        });

        console.log("New answer: ", newAnswer);

        await newAnswer.save();

        user.userAnswers.push(newAnswer._id);

        await user.save();

        const question = await Question.findById(questionID);

        if (!question) {
            return NextResponse.json(
                {
                    error: "question",
                    message: "No question found with that id.",
                },
                { status: 400 }
            );
        }

        question.answers.push(newAnswer._id);

        await question.save();

        return NextResponse.json({
            success: true,
            message: "Successfully created an answer.",
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
