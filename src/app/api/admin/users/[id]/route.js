import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import User from "@/models/User";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET SINGLE USER
// ==========================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const foundUser = await User.findById(params.id)

      .select("-password");

    if (!foundUser) {
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

      user: foundUser,
    });
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

// ==========================================
// UPDATE USER
// ROLE / STATUS
// ==========================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const body = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      params.id,

      {
        role: body.role,

        status: body.status,
      },

      {
        new: true,
      },
    )

      .select("-password");

    if (!updatedUser) {
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

      message: "User updated successfully",

      user: updatedUser,
    });
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

// ==========================================
// DELETE USER
// ==========================================

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const deletedUser = await User.findByIdAndDelete(params.id);

    if (!deletedUser) {
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

      message: "User deleted successfully",
    });
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
