import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema(
    {
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
        questionAnsweredOn: {
            type: Schema.Types.ObjectId,
            ref: "Question",
        },
    },
    {
        timestamps: true,
    }
);

const Answer = mongoose.models.Answer || mongoose.model("Answer", answerSchema);

export default Answer;
