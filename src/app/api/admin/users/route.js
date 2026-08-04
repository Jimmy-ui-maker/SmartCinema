import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import User from "@/models/User";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET ALL USERS
// ADMIN ONLY
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const users = await User.find()

      .select("-password")

      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,

      users,
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
// ADMIN CREATE STAFF ACCOUNT
// ADMIN ONLY
// ==========================================

export async function POST(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const body = await request.json();

    const { firstName, lastName, email, phone, password, role } = body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },

        {
          status: 400,
        },
      );
    }

    const bcrypt = await import("bcryptjs");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,

      lastName,

      email,

      phone,

      password: hashedPassword,

      role: role || "Customer",

      status: "Active",
    });

    return NextResponse.json(
      {
        success: true,

        message: "User created successfully",

        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        },
      },

      {
        status: 201,
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
