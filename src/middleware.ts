import { NextResponse, NextRequest } from "next/server";
import { PUBLIC_PATHS } from "@/constants";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const token =
        request.cookies.get("token")?.value ||
        request.cookies.get("next-auth.session-token")?.value ||
        "";

    const isAuthenticated = !!token;

    const isPublicPath = PUBLIC_PATHS.includes(path);

    const isQuestionsPath = path === "/questions";

    if (isAuthenticated) {
        if (isPublicPath && !isQuestionsPath) {
            return NextResponse.redirect(
                new URL("/dashboard", request.nextUrl)
            );
        }
    } else {
        if (!isPublicPath && !isQuestionsPath) {
            const redirectUrl = new URL("/login", request.nextUrl);

            redirectUrl.searchParams.set("from", path);

            return NextResponse.redirect(redirectUrl);
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/signup",
        "/verify-email",
        "/forgot-password",
        "/forgot-password/recovery",
        "/dashboard",
        "/dashboard/:path",
        "/questions",
        "/questions/:path",
        "/my-profile",
        "/my-profile/:path",
    ],
};
