import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectToDB from "@/lib/db";
import User from "@/models/User";

import { authMiddleware } from "@/middleware/authMiddleware";

// =====================================
// CHANGE PASSWORD
// =====================================

export async function PUT(request) {
  try {
    await connectToDB();

    const auth = await authMiddleware(request);

    if (auth instanceof Response) {
      return auth;
    }

    const body = await request.json();

    const { currentPassword, newPassword, confirmPassword } = body;

    // ==========================
    // VALIDATION
    // ==========================

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "All password fields are required.",
        },
        {
          status: 400,
        },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 6 characters.",
        },
        {
          status: 400,
        },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        {
          status: 400,
        },
      );
    }

    // ==========================
    // FIND USER
    // ==========================

    const user = await User.findById(auth.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    // ==========================
    // VERIFY CURRENT PASSWORD
    // ==========================

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect.",
        },
        {
          status: 400,
        },
      );
    }

    // Prevent using same password

    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be different from your current password.",
        },
        {
          status: 400,
        },
      );
    }

    // ==========================
    // HASH NEW PASSWORD
    // ==========================

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    // ==========================
    // SUCCESS
    // ==========================

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
