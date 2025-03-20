import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of paths that require authentication
const protectedPaths = ["/dashboard", "/profile", "/messages", "/settings"]

// List of paths that should redirect to dashboard if already authenticated
const authPaths = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the path is protected
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))
    const isAuthPath = authPaths.some((path) => pathname.startsWith(path))

    // Get the token from cookies
    const token = request.cookies.get("token")?.value

    // If the path is protected and there's no token, redirect to login
    if (isProtectedPath && !token) {
        const url = new URL("/auth/login", request.url)
        url.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(url)
    }

    // If the path is an auth path and there's a token, redirect to dashboard
    if (isAuthPath && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}

