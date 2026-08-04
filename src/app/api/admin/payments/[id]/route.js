import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Payment from "@/models/Payment";

import Booking from "@/models/Booking";

import Ticket from "@/models/Ticket";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET SINGLE PAYMENT
// ==========================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
    }

    const payment = await Payment.findById(params.id)

      .populate("customer", "-password")

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

// ==========================================
// VERIFY PAYMENT
// ADMIN / CASHIER
// ==========================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
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

    // only verify submitted payments

    if (payment.paymentStatus !== "Submitted") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment already processed",
        },

        {
          status: 400,
        },
      );
    }

    // UPDATE PAYMENT

    payment.paymentStatus = "Verified";

    payment.verifiedBy = user.id;

    payment.verifiedAt = new Date();

    await payment.save();

    // CONFIRM BOOKING

    const booking = await Booking.findByIdAndUpdate(
      payment.booking,

      {
        bookingStatus: "Confirmed",
      },

      {
        new: true,
      },
    );

    // GENERATE TICKET AUTOMATICALLY

    const existingTicket = await Ticket.findOne({
      booking: payment.booking,
    });

    let ticket = null;

    if (!existingTicket) {
      ticket = await Ticket.create({
        ticketNumber: "TKT-" + Date.now(),

        booking: payment.booking,

        ticketStatus: "Valid",
      });
    }

    return NextResponse.json({
      success: true,

      message: "Payment verified successfully",

      payment,

      ticket,
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
// REJECT PAYMENT
// ADMIN / CASHIER
// ==========================================

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
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

    payment.paymentStatus = "Rejected";

    payment.verifiedBy = user.id;

    payment.verifiedAt = new Date();

    await payment.save();

    return NextResponse.json({
      success: true,

      message: "Payment rejected successfully",
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
