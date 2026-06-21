// ============================================
// FILE: app/api/auth/check/route.js
// ============================================
import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  return NextResponse.json({ loggedIn: true, user: decoded });
}
