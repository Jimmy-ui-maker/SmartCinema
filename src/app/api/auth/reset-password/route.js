import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectToDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectToDB();

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Token and password are required.",
        },
        {
          status: 400,
        },
      );
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token.",
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // Clear token
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully. You can now login.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
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
