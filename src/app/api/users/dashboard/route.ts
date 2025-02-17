import Question from "@/models/questionModel";
import { connectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDb();

        let questions = [];

        questions = await Question.find({})
            .populate("owner", "username")
            .sort({ createdAt: -1 })
            .limit(5)
            .exec();
        return NextResponse.json({ arr: questions }, { status: 200 });
    } catch (error: any) {
        console.error("Error while getting questions from database.", error);
        return NextResponse.json({ error: error.message });
    }
}
