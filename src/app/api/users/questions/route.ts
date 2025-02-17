import { NextRequest, NextResponse } from "next/server";
import Question from "@/models/questionModel";
import { connectDb } from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        await connectDb();

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const sortBy = url.searchParams.get("sortBy") || "Newest";
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        let sortOptions = {};

        switch (sortBy) {
            case "upvotes":
                sortOptions = { upvotes: -1, createdAt: -1 };
                break;
            case "activity":
                sortOptions = { "answers.length": -1, createdAt: -1 };
                break;
            case "Newest":
            default:
                sortOptions = { createdAt: -1 };
                break;
        }

        const total = await Question.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const questions = await Question.find()
            .populate("owner", "username")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            success: true,
            questions,
            pagination: {
                total,
                totalPages,
                page,
                skip,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message,
            },
            { status: 500 }
        );
    }
}
