import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Payment from "@/models/Payment";

import Booking from "@/models/Booking";

import { authMiddleware } from "@/middleware/authMiddleware";

// ========================================
// GET ALL PAYMENTS
// ADMIN / CASHIER
// ========================================

export async function GET(request) {
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
          message: "Access denied",
        },

        {
          status: 403,
        },
      );
    }

    const payments = await Payment.find()

      .populate("customer")

      .populate({
        path: "booking",

        populate: {
          path: "schedule",

          populate: [
            {
              path: "movie",
            },

            {
              path: "hall",
            },
          ],
        },
      })

      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,

      payments,
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

// ========================================
// CUSTOMER SUBMIT PAYMENT
// ========================================

export async function POST(request) {
  try {
    await connectToDB();

    const user = await authMiddleware(request);

    if (user instanceof Response) {
      return user;
    }

    if (user.role !== "Customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Only customers can submit payment",
        },

        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const {
      booking,

      amount,

      paymentProof,
    } = body;

    // check booking belongs to user

    const currentBooking = await Booking.findById(booking);

    if (!currentBooking) {
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

    if (currentBooking.customer.toString() !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot pay for this booking",
        },

        {
          status: 403,
        },
      );
    }

    const payment = await Payment.create({
      booking,

      customer: user.id,

      amount,

      paymentProof,

      paymentMethod: "Manual Transfer",

      paymentStatus: "Submitted",
    });

    return NextResponse.json(
      {
        success: true,

        message: "Payment proof submitted successfully",

        payment,
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
