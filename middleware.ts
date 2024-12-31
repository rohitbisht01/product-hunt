import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

// Use only one of the two middleware options below
// 1. Use middleware directly
export const { auth: authMiddleware } = NextAuth(authConfig);

// 2. Wrapped middleware option
// const { auth } = NextAuth(authConfig);
export async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
  if ((await isAdminAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

async function isAdminAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (authHeader == null) return false;

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return true;
  }

  return false;
}

export const config = {
  middleware: ["authMiddleware", "middleware"],
  matcher: "/admin/:path*",
};
