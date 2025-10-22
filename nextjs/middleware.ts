import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered for:", request.url);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/:lang/player/:path*"],
};
