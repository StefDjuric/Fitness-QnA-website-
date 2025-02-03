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
    mongoose.models["Questions"] || mongoose.model("Question", questionSchema);

export default Question;
