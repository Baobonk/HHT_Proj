import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    { message: "Đăng xuất admin thành công" },
    { status: 200 }
  );

  // Xoá cookie admin_token
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // xoá ngay lập tức
  });

  return res;
}
