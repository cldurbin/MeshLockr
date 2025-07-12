// src/middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Define which routes should remain publicly accessible
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/api/health",
  ],
});

export const config = {
  // Match all routes except static files (_next, assets, etc.)
  matcher: ["/((?!_next|.*\\..*).*)"],
};
