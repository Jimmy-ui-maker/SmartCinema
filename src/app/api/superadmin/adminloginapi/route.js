import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import SuperAdmin from "@/models/SuperAdmin";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // FIND ADMIN
    // ==========================================

    const admin = await SuperAdmin.findOne({
      email,
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================
    // BLOCKED ACCOUNT
    // ==========================================

    if (admin.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been blocked.",
        },
        {
          status: 403,
        }
      );
    }

    // ==========================================
    // PASSWORD CHECK
    // ==========================================

    if (admin.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================
    // CREATE JWT
    // ==========================================

    const token = generateToken(admin);

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",

        token,

        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          address: admin.address,
          role: admin.role,
          imgUrl: admin.imgUrl,
          isBlocked: admin.isBlocked,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}