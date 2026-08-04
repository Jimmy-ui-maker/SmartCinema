import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Hall from "@/models/Hall";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET SINGLE HALL
// ==========================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const hall = await Hall.findById(params.id);

    if (!hall) {
      return NextResponse.json(
        {
          success: false,
          message: "Hall not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      hall,
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
// UPDATE HALL
// ==========================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const body = await request.json();

    const hall = await Hall.findByIdAndUpdate(
      params.id,

      body,

      {
        new: true,
      },
    );

    if (!hall) {
      return NextResponse.json(
        {
          success: false,
          message: "Hall not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Hall updated successfully",

      hall,
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
// DELETE HALL
// ==========================================

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const hall = await Hall.findByIdAndDelete(params.id);

    if (!hall) {
      return NextResponse.json(
        {
          success: false,
          message: "Hall not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Hall deleted successfully",
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
