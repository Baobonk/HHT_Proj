import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // USER token (logic cũ)
  const userToken = request.cookies.get("token")?.value;
  const isUserLoggedIn = !!userToken;

  // ADMIN token
  const adminToken = request.cookies.get("admin_token")?.value;
  const isAdminLoggedIn = !!adminToken;

  // =============================================
  // 1) Bảo vệ /admin/* (trừ /admin/login)
  // =============================================
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";

  // vào /admin/... mà chưa có admin_token -> về trang login admin
  if (isAdminPath && !isAdminLoginPage && !isAdminLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // nếu đã có admin_token mà vẫn vào /admin/login -> chuyển thẳng sang /admin
  if (isAdminLoginPage && isAdminLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // =============================================
  // 2) Logic cũ: user đã login thì không được vào /login, /register
  // =============================================
  if ((pathname === "/login" || pathname === "/register") && isUserLoggedIn) {
    return NextResponse.redirect(new URL("/room", request.url));
  }

  // =============================================
  // 3) Cho phép tiếp tục
  // =============================================
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",   // bao cả /admin, /admin/login, /admin/...
  ],
};
