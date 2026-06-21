// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Helper: lấy admin từ cookie + kiểm tra quyền
async function getAdminFromRequest(request) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return {
      error: NextResponse.json(
        { message: "Chưa đăng nhập (thiếu admin_token)" },
        { status: 401 }
      ),
    };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("Lỗi verify admin_token:", err);
    return {
      error: NextResponse.json(
        { message: "Token quản trị không hợp lệ" },
        { status: 401 }
      ),
    };
  }

  const admin = await User.findById(decoded.id).lean();

  if (!admin) {
    return {
      error: NextResponse.json(
        { message: "Không tìm thấy tài khoản quản trị" },
        { status: 404 }
      ),
    };
  }

  // CHỈ CHO PHÉP admin
  if (admin.role !== "admin") {
    return {
      error: NextResponse.json(
        { message: "Bạn không có quyền quản lý tài khoản (chỉ admin)" },
        { status: 403 }
      ),
    };
  }

  return { admin };
}

// =============================
// GET /api/admin/users
// → Lấy danh sách user
// =============================
export async function GET(request) {
  try {
    await connectDB();

    const { admin, error } = await getAdminFromRequest(request);
    if (error) return error; // 401 / 403 / 404

    // Nếu muốn, có thể không trả về chính admin ở đây, chỉ list user
    const users = await User.find({})
      .select("-password -resetPasswordToken -resetPasswordExpires -verificationToken")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { users },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json(
      { message: "Lỗi server khi lấy danh sách tài khoản" },
      { status: 500 }
    );
  }
}

// =============================
// POST /api/admin/users
// → Tạo tài khoản mới
// body: { username, email, role, password }
// =============================
export async function POST(request) {
  try {
    await connectDB();

    const { admin, error } = await getAdminFromRequest(request);
    if (error) return error; // chỉ admin mới được tạo

    const body = await request.json();
    const { username, email, role = "player", password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username và password là bắt buộc" },
        { status: 400 }
      );
    }

    // Ngăn role linh tinh
    const allowedRoles = ["player", "user", "admin"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { message: "Giá trị role không hợp lệ" },
        { status: 400 }
      );
    }

    // Check trùng username
    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { message: "Username đã tồn tại, hãy chọn tên khác" },
        { status: 400 }
      );
    }

    const newUser = new User({
      username,
      email,
      role,
      password, // sẽ được hash trong pre('save')
    });

    await newUser.save();

    const userSafe = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(
      {
        message: "Tạo tài khoản thành công",
        user: userSafe,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/admin/users error:", err);
    return NextResponse.json(
      { message: "Lỗi server khi tạo tài khoản" },
      { status: 500 }
    );
  }
}
