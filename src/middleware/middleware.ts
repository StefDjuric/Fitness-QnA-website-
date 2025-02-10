import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublicPath =
        path === "/login" || path === "/signup" || path === "/verify-email";

    const token = request.cookies.get("token")?.value || "";

    if (isPublicPath && token)
        return NextResponse.redirect(new URL("/", request.nextUrl));
    else if (!isPublicPath && !token)
        return NextResponse.redirect(new URL("/login", request.nextUrl));
}

export const config = {
    matcher: ["/", "/login", "/signup", "verify-email"],
};
