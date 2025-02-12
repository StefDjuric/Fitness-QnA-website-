import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token =
            request.cookies.get("token")?.value ||
            request.cookies.get("next-auth.session-token")?.value;

        if (!token) {
            return NextResponse.json({ isLoggedIn: false });
        }

        return NextResponse.json({ isLoggedIn: true });
    } catch (error: any) {
        return NextResponse.json({ isLoggedIn: false });
    }
}
