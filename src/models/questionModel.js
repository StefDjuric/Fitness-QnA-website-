import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        votes: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                voteType: {
                    type: Number,
                    enum: [1, 0, -1],
                    default: 0,
                },
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        answers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Answer",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Question =
    mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
