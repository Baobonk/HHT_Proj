// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Helper y như file trên (có thể tách ra file chung nếu thích)
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
// PUT /api/admin/users/[id]
// → Cập nhật tài khoản
// body: { username?, email?, role?, password? }
// Nếu password trống -> không đổi password
// =============================
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { admin, error } = await getAdminFromRequest(request);
    if (error) return error;

    const { id } = params;
    const body = await request.json();
    const { username, email, role, password } = body;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản cần sửa" },
        { status: 404 }
      );
    }

    if (username) user.username = username;
    if (email !== undefined) user.email = email;

    if (role) {
      const allowedRoles = ["player", "user", "admin"];
      if (!allowedRoles.includes(role)) {
        return NextResponse.json(
          { message: "Giá trị role không hợp lệ" },
          { status: 400 }
        );
      }
      user.role = role;
    }

    // Nếu có truyền password và không rỗng -> đổi password
    if (typeof password === "string" && password.trim()) {
      user.password = password; // sẽ được hash ở pre("save")
    }

    await user.save();

    const userSafe = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(
      {
        message: "Cập nhật tài khoản thành công",
        user: userSafe,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /api/admin/users/[id] error:", err);
    return NextResponse.json(
      { message: "Lỗi server khi cập nhật tài khoản" },
      { status: 500 }
    );
  }
}

// =============================
// DELETE /api/admin/users/[id]
// → Xóa tài khoản
// =============================
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { admin, error } = await getAdminFromRequest(request);
    if (error) return error;

    const { id } = params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản cần xóa" },
        { status: 404 }
      );
    }

    await user.deleteOne();

    return NextResponse.json(
      {
        message: `Đã xóa tài khoản ${user.username}`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/admin/users/[id] error:", err);
    return NextResponse.json(
      { message: "Lỗi server khi xóa tài khoản" },
      { status: 500 }
    );
  }
}
