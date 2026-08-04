import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Hall from "@/models/Hall";

// =================================
// GET SINGLE HALL
// =================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

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

// =================================
// UPDATE HALL
// =================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const body = await request.json();

    const { name, capacity, rows, seatsPerRow, status } = body;

    // ==========================
    // GENERATE SEATS AGAIN
    // ==========================

    const seats = [];

    if (rows && seatsPerRow) {
      rows.forEach((row) => {
        for (let i = 1; i <= Number(seatsPerRow); i++) {
          seats.push({
            row,
            number: i,
          });
        }
      });
    }

    // ==========================
    // UPDATE
    // ==========================

    const hall = await Hall.findByIdAndUpdate(
      params.id,
      {
        name,
        capacity: Number(capacity),
        status,
        seats,
      },
      {
        new: true,
        runValidators: true,
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

// =================================
// DELETE HALL
// =================================

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

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
