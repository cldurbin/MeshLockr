// src/middleware.ts
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/api/health",
  ],
  afterAuth(auth, req) {
    const isLoggedIn = !!auth.userId;
    const hasOrg = !!auth.orgId;
    const isOnboarding = req.nextUrl.pathname.startsWith("/onboarding");

    if (isLoggedIn && !hasOrg && !isOnboarding) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // Match all routes except static files
};
