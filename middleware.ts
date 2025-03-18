import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"


function isUserContentCreator(request: NextRequest): boolean {
    const USER_ROLE_COOKIE = "user_role";
    const USER_ROLE_RAW_COOKIE = "user_role_raw";
    const USER_TYPE_COOKIE = "user_type";
    const USER_IS_CONTENT_CREATOR = "user_is_content_creator";
    const USER_IS_COMPANY = "user_is_company";

    // Überprüfen Sie zuerst, ob der Benutzer explizit als COMPANY markiert ist
    const isCompany = request.cookies.get(USER_IS_COMPANY)?.value === "true";
    if (isCompany) {
        console.log("Middleware: User is explicitly marked as COMPANY");
        return false;
    }

    const userType = request.cookies.get(USER_TYPE_COOKIE)?.value;
    if (userType === "COMPANY") {
        console.log("Middleware: User type is COMPANY");
        return false;
    }

    const userRole = request.cookies.get(USER_ROLE_COOKIE)?.value;
    if (userRole && userRole.toUpperCase().includes("COMPANY")) {
        console.log("Middleware: User role contains COMPANY");
        return false;
    }

    const userRoleRaw = request.cookies.get(USER_ROLE_RAW_COOKIE)?.value;
    if (userRoleRaw && userRoleRaw.toUpperCase().includes("COMPANY")) {
        console.log("Middleware: User raw role contains COMPANY");
        return false;
    }

    // Wenn keine der obigen Bedingungen zutrifft, handelt es sich um einen Content Creator
    return true;
}

// Helper function to check if a user is authenticated
function isAuthenticated(request: NextRequest): boolean {
    const TOKEN_COOKIE = "auth_token"
    return !!request.cookies.get(TOKEN_COOKIE)?.value
}

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    console.log("Middleware checking path:", path)

    // Public paths that don't require authentication
    const publicPaths = [
        "/",
        "/select-role",
        "/login/company",
        "/login/content-creator",
        "/register/company",
        "/register/content-creator",
        "/forgot-password/company",
        "/forgot-password/content-creator",
        "/reset-password/company",
        "/reset-password/content-creator",
        "/verify-email",
        "/services",
        "/news",
        "/about",
        "/contact",
    ]

    // Check if the path is public
    const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(publicPath + "/"))

    if (isPublicPath) {
        return NextResponse.next()
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated(request)) {
        console.log("No token found, redirecting to select-role")
        return NextResponse.redirect(new URL("/select-role", request.url))
    }

    // Check if the user is a content creator with improved logging
    const isUserContentCreatorValue = isUserContentCreator(request)
    console.log("Middleware - Is user content creator:", isUserContentCreatorValue)

    // If the path is /dashboard, redirect based on role
    if (path === "/dashboard" || path === "/dashboard/") {
        if (isUserContentCreatorValue) {
            console.log("Middleware - Redirecting to content creator dashboard from /dashboard")
            return NextResponse.redirect(new URL("/dashboard/content-creator", request.url))
        } else {
            console.log("Middleware - Redirecting to company dashboard from /dashboard")
            return NextResponse.redirect(new URL("/dashboard/company", request.url))
        }
    }

    // If the path leads to the wrong dashboard, redirect to the correct dashboard
    if (path.startsWith("/dashboard/company") && isUserContentCreatorValue) {
        console.log("Middleware - Redirecting content creator from company dashboard to content creator dashboard")
        return NextResponse.redirect(new URL("/dashboard/content-creator", request.url))
    }

    if (path.startsWith("/dashboard/content-creator") && !isUserContentCreatorValue) {
        console.log("Middleware - Redirecting company from content creator dashboard to company dashboard")
        return NextResponse.redirect(new URL("/dashboard/company", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

