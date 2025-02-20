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
        let pipeline = [];

        if (sortBy === "activity") {
            pipeline = [
                {
                    $addFields: {
                        answersCount: { $size: { $ifNull: ["$answers", []] } },
                    },
                },
                {
                    $sort: {
                        answersCount: -1,
                        createdAt: -1,
                    } as const,
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "ownerDetails",
                    },
                },
                {
                    $addFields: {
                        owner: {
                            $cond: {
                                if: {
                                    $gt: [{ $size: "$ownerDetails" }, 0],
                                },
                                then: {
                                    _id: {
                                        $arrayElemAt: ["$ownerDetails._id", 0],
                                    },
                                    username: {
                                        $arrayElemAt: [
                                            "$ownerDetails._username",
                                            0,
                                        ],
                                    },
                                },
                                else: null,
                            },
                        },
                    },
                },
                {
                    $project: { ownerDetails: 0 },
                },
            ];

            const total = await Question.countDocuments();
            const totalPages = Math.ceil(total / limit);
            const questions = await Question.aggregate(pipeline);

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
        }

        let sortOptions = {};

        switch (sortBy) {
            case "upvotes":
                sortOptions = { upvotes: -1, createdAt: -1 };
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
