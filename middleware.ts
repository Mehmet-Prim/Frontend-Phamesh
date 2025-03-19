import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Funktion zum Setzen der Rolle basierend auf dem Pfad
function setRoleBasedOnPath(request: NextRequest): NextResponse {
    const path = request.nextUrl.pathname;
    const response = NextResponse.next();

    if (path.includes("/company")) {
        response.cookies.set("user_role", "ROLE_COMPANY", { path: "/" });
        response.cookies.set("user_role_raw", "COMPANY", { path: "/" });
        response.cookies.set("user_type", "COMPANY", { path: "/" });
        response.cookies.set("user_is_content_creator", "false", { path: "/" });
        response.cookies.set("user_is_company", "true", { path: "/" });
    } else if (path.includes("/content-creator")) {
        response.cookies.set("user_role", "ROLE_CONTENT_CREATOR", { path: "/" });
        response.cookies.set("user_role_raw", "CONTENT_CREATOR", { path: "/" });
        response.cookies.set("user_type", "CONTENT_CREATOR", { path: "/" });
        response.cookies.set("user_is_content_creator", "true", { path: "/" });
        response.cookies.set("user_is_company", "false", { path: "/" });
    }

    return response;
}

// Funktion zum Überprüfen, ob der Benutzer authentifiziert ist
function isAuthenticated(request: NextRequest): boolean {
    const token = request.cookies.get("token")?.value;
    return !!token;
}

// Funktion zum Überprüfen, ob der Benutzer ein Content Creator ist
function isUserContentCreator(request: NextRequest): boolean {
    const userIsContentCreator = request.cookies.get("user_is_content_creator")?.value;
    return userIsContentCreator === "true";
}

// Public paths that don't require authentication
const publicPaths: string[] = [
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
];

// Middleware-Funktion
export function middleware(request: NextRequest): NextResponse {
    const path = request.nextUrl.pathname;

    // Ignoriere statische Dateien und API-Routen
    if (
        path.startsWith("/_next/") || // Next.js interne Dateien
        path.startsWith("/api/") ||   // API-Routen
        path.startsWith("/static/") || // Statische Dateien
        path.includes(".") // Dateien mit Erweiterungen (z. B. .css, .js, .png)
    ) {
        return NextResponse.next();
    }

    console.log("Middleware checking path:", path);

    // Setze die Rolle basierend auf dem Pfad
    if (path.includes("/login/") || path.includes("/register/") || path.includes("/dashboard/")) {
        return setRoleBasedOnPath(request);
    }

    // Check if the path is public
    const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(publicPath + "/"));

    if (isPublicPath) {
        return NextResponse.next();
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated(request)) {
        console.log("No token found, redirecting to select-role");
        return NextResponse.redirect(new URL("/select-role", request.url));
    }

    // Wenn der Pfad explizit ein Company-Pfad ist, erlaube den Zugriff ohne weitere Überprüfung
    if (path.startsWith("/dashboard/company")) {
        console.log("Middleware - Allowing access to company dashboard without role check");
        return NextResponse.next();
    }

    // Wenn der Pfad explizit ein Content-Creator-Pfad ist, erlaube den Zugriff ohne weitere Überprüfung
    if (path.startsWith("/dashboard/content-creator")) {
        console.log("Middleware - Allowing access to content creator dashboard without role check");
        return NextResponse.next();
    }

    // Check if the user is a content creator with improved logging
    const isUserContentCreatorValue = isUserContentCreator(request);
    console.log("Middleware - Is user content creator:", isUserContentCreatorValue);

    // If the path is /dashboard, redirect based on role
    if (path === "/dashboard" || path === "/dashboard/") {
        const redirectPath = isUserContentCreatorValue ? "/dashboard/content-creator" : "/dashboard/company";
        console.log(`Middleware - Redirecting to ${redirectPath} from /dashboard`);
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
}

