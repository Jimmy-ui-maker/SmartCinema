import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import User from "@/models/User";
import { authMiddleware } from "@/middleware/authMiddleware";

// =====================================
// GET PROFILE
// =====================================

export async function GET(request) {
  try {
    await connectToDB();

    const auth = await authMiddleware(request);

    if (auth instanceof Response) {
      return auth;
    }

    const user = await User.findById(auth.id).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      user,
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

// =====================================
// UPDATE PROFILE
// =====================================

export async function PUT(request) {
  try {
    await connectToDB();

    const auth = await authMiddleware(request);

    if (auth instanceof Response) {
      return auth;
    }

    const body = await request.json();

    const { firstName, lastName, phone, profilePicture } = body;

    const user = await User.findById(auth.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    // ==========================
    // Update allowed fields only
    // ==========================

    if (firstName !== undefined) {
      user.firstName = firstName;
    }

    if (lastName !== undefined) {
      user.lastName = lastName;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
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
