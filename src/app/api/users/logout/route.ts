import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json(
            { message: "Logout successfull", success: true },
            { status: 200 }
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        response.cookies.set("next-auth.session-token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: "logout", message: "Error while trying to log out." },
            { status: 500 }
        );
    }
}
