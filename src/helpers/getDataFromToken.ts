import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";

export const getDataFromToken = async (request: NextRequest) => {
    try {
        const session = await getServerSession(nextAuthOptions);

        if (session?.user?.id) {
            return session.user.id;
        }
        const token = request.cookies.get("token")?.value || "";

        if (token) {
            const decodedToken: any = jwt.verify(
                token,
                process.env.TOKEN_SECRET!
            );
            return decodedToken.id;
        }

        return null;
    } catch (error: any) {
        console.log("Error getting userID from token. ", error.message);
        return null;
    }
};
