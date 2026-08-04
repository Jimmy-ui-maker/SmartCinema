import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Schedule from "@/models/Schedule";

// Register models for populate()
import "@/models/Movie";
import "@/models/Hall";

// =====================================
// GET SINGLE SCHEDULE
// =====================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const schedule = await Schedule.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
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
// UPDATE SCHEDULE
// =====================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const body = await request.json();

    const schedule = await Schedule.findByIdAndUpdate(params.id, body, {
      new: true,
    })
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
// DELETE SCHEDULE
// =====================================

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

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
      message: "Schedule deleted successfully",
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
