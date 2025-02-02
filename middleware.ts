import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/portal", "/admin"];
const counselorRoutes = ["/counselor", "/admin"];
const userRoutes = ["/portal"];
const publicRoutes = ["/", "/signin", "/signup", "/arenasignup"];

export async function middleware(request: NextRequest) {
    const userId = request.cookies.get("userid")?.value;
    const counselorId = request.cookies.get("counselorid")?.value;
    const pathname = request.nextUrl.pathname;

    const pathStartsWith = (routes: string[]) => {
        return routes.some(route => pathname.startsWith(route));
    };

    // Redirect to sign-in if user is not authenticated and tries to access protected routes
    if (!userId && !counselorId && pathStartsWith(protectedRoutes)) {
        const url = new URL("/signin", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from sign-in/sign-up pages
    if ((userId || counselorId) && pathStartsWith(["/signin", "/signup"])) {
        return NextResponse.redirect(new URL("/portal", request.url));
    }

    // Redirect counselors away from user-only routes
    if (counselorId && pathStartsWith(userRoutes)) {
        return NextResponse.redirect(new URL("/counselor", request.url));
    }

    // Redirect users away from counselor-only routes
    if (userId && pathStartsWith(counselorRoutes)) {
        return NextResponse.redirect(new URL("/portal", request.url));
    }

    // Allow counselors to access the admin route
    if (pathname.startsWith("/admin") && counselorId) {
        return NextResponse.next(); // Allow access
    } else if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/signin", request.url)); // Redirect to signin
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};