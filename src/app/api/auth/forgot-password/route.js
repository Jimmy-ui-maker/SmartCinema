import { NextResponse } from "next/server";
import crypto from "crypto";

import connectToDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectToDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        {
          status: 400,
        },
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No account found with this email.",
        },
        {
          status: 404,
        },
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;

    // Valid for 15 minutes
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password reset token generated successfully.",

        // REMOVE THIS WHEN EMAIL IS IMPLEMENTED
        resetToken: token,

        expiresAt: user.resetPasswordExpires,
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
