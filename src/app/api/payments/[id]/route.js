import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Payment from "@/models/Payment";

import Booking from "@/models/Booking";

import { authMiddleware } from "@/middleware/authMiddleware";

// ========================================
// GET SINGLE PAYMENT
// ========================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const user = await authMiddleware(request);

    if (user instanceof Response) {
      return user;
    }

    if (
      user.role === "Customer" &&
      payment.customer._id.toString() !== user.id
    ) {
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

    const payment = await Payment.findById(params.id)

      .populate("customer")

      .populate("booking");

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      payment,
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
// VERIFY PAYMENT
// CASHIER / ADMIN
// ========================================

export async function PUT(request, { params }) {
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
          message: "Only staff can verify payment",
        },

        {
          status: 403,
        },
      );
    }

    const payment = await Payment.findById(params.id);

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found",
        },

        {
          status: 404,
        },
      );
    }

    payment.paymentStatus = "Verified";

    payment.verifiedBy = user.id;

    payment.verifiedAt = new Date();

    await payment.save();

    await Booking.findByIdAndUpdate(
      payment.booking,

      {
        bookingStatus: "Confirmed",
      },
    );

    return NextResponse.json({
      success: true,

      message: "Payment verified successfully",

      payment,
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
// DELETE / REJECT PAYMENT
// ========================================

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
          message: "Access denied",
        },
        {
          status: 403,
        },
      );
    }

    const payment = await Payment.findByIdAndDelete(params.id);

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Payment removed",
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
