import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Schedule from "@/models/Schedule";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET SINGLE SCHEDULE
// ==========================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const schedule = await Schedule.findById(params.id)

      .populate("movie")

      .populate("hall");

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Schedule not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      schedule,
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
// UPDATE SCHEDULE
// ==========================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const body = await request.json();

    const schedule = await Schedule.findByIdAndUpdate(
      params.id,

      body,

      {
        new: true,
      },
    )

      .populate("movie")

      .populate("hall");

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Schedule not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Schedule updated successfully",

      schedule,
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
// DELETE / CANCEL SCHEDULE
// ==========================================

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const schedule = await Schedule.findByIdAndDelete(params.id);

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Schedule not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Schedule removed successfully",
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
