import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Booking from "@/models/Booking";

import Schedule from "@/models/Schedule";

import { authMiddleware } from "@/middleware/authMiddleware";

// ======================================
// GET SINGLE BOOKING
// ======================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const booking = await Booking.findById(params.id)

      .populate("customer")

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

// ======================================
// CANCEL BOOKING
// ======================================

// ======================================
// UPDATE BOOKING
// ======================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const user = await authMiddleware(request);

    if (user instanceof Response) {
      return user;
    }

    const body = await request.json();

    const booking = await Booking.findById(params.id);

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

    // Customer can update ONLY his booking
    if (
      user.role === "Customer" &&
      booking.customer.toString() !== user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot modify this booking.",
        },
        {
          status: 403,
        },
      );
    }

    // ==========================
    // CASHIER REVOKES BOOKING
    // ==========================

    if (
      body.bookingStatus === "Cancelled" &&
      body.paymentStatus === "Failed"
    ) {
      const schedule = await Schedule.findById(booking.schedule);

      if (schedule) {
        schedule.bookedSeats = schedule.bookedSeats.filter(
          (seat) => !booking.seats.includes(seat),
        );

        await schedule.save();
      }
    }

    booking.bookingStatus =
      body.bookingStatus ?? booking.bookingStatus;

    booking.paymentStatus =
      body.paymentStatus ?? booking.paymentStatus;

    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully.",
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

// ======================================
// REVOKE BOOKING
// ======================================

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const user = await authMiddleware(request);

    if (user instanceof Response) {
      return user;
    }

    if (user.role !== "Admin" && user.role !== "Cashier") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 403,
        },
      );
    }

    const booking = await Booking.findById(params.id);

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

    if (booking.paymentStatus === "Paid") {
      return NextResponse.json(
        {
          success: false,
          message: "Paid bookings cannot be revoked.",
        },
        {
          status: 400,
        },
      );
    }

    const schedule = await Schedule.findById(booking.schedule);

    if (schedule) {
      schedule.bookedSeats = schedule.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat),
      );

      await schedule.save();
    }

    booking.bookingStatus = "Cancelled";
    booking.paymentStatus = "Failed";

    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Booking revoked successfully.",
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
