import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide an username!"],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email!"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password!"],
        },
        avatar: {
            type: String,
            required: false,
        },
        userQuestions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        userAnswers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Answer",
            },
        ],
        forgotPasswordToken: String,
        forgotPasswordTokenExpiration: Date,
        verifyToken: String,
        verifyTokenExpiration: Date,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models["Users"] || mongoose.model("User", userSchema);

export default User;
