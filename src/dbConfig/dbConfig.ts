import mongoose from "mongoose";

export async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);

        const connection = mongoose.connection;

        connection.on("connected", () => console.log("Database connected"));

        connection.on("error", (err) =>
            console.log("MongoDB connection error. " + err)
        );
    } catch (error) {
        console.log("Something went wrong while connecting to DB! ", error);
    }
}
