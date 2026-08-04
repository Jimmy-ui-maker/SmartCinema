import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Booking from "@/models/Booking";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET SINGLE BOOKING
// ==========================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
    }

    const booking = await Booking.findById(params.id)

      .populate("customer", "-password")

      .populate({
        path: "schedule",

        populate: [
          {
            path: "movie",
          },

          {
            path: "hall",
          },
        ],
      });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      booking,
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
// UPDATE BOOKING STATUS
// ==========================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
    }

    const body = await request.json();

    const booking = await Booking.findByIdAndUpdate(
      params.id,

      {
        bookingStatus: body.bookingStatus,
      },

      {
        new: true,
      },
    );

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Booking updated successfully",

      booking,
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
