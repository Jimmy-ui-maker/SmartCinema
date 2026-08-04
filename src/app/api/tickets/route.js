import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Ticket from "@/models/Ticket";
import Booking from "@/models/Booking";

// Register referenced models
import "@/models/User";
import "@/models/Movie";
import "@/models/Hall";
import "@/models/Schedule";

import { authMiddleware } from "@/middleware/authMiddleware";

// =====================================
// GET ALL TICKETS
// ADMIN / CASHIER ONLY
// =====================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await authMiddleware(request);

    if (user instanceof Response) {
      return user;
    }

    if (user.role !== "Admin" && user.role !== "Cashier" && user.role !== "Customer") {
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

    const tickets = await Ticket.find()
      .populate("customer")
      .populate("movie")
      .populate("hall")
      .populate({
        path: "booking",
        populate: [
          {
            path: "customer",
          },
          {
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
        ],
      })
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      tickets,
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

// =====================================
// CREATE TICKET
// ADMIN / CASHIER ONLY
// =====================================

export async function POST(request) {
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
          message: "Only staff can generate tickets",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const { booking } = body;

    // =====================================
    // CHECK EXISTING TICKET
    // =====================================

    const existingTicket = await Ticket.findOne({
      booking,
    });

    if (existingTicket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket already generated",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================
    // LOAD BOOKING
    // =====================================

    const bookingData = await Booking.findById(booking).populate({
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

    if (!bookingData) {
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

    // =====================================
    // PAYMENT CHECK
    // =====================================

    if (bookingData.paymentStatus !== "Paid") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment has not been confirmed.",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================
    // GENERATE TICKET NUMBER
    // =====================================

    const ticketNumber =
      "TKT-" +
      new Date().getFullYear() +
      "-" +
      Math.floor(100000 + Math.random() * 900000);

    // =====================================
    // CREATE TICKET
    // =====================================

    const ticket = await Ticket.create({
      ticketNumber,

      booking: bookingData._id,

      customer: bookingData.customer,

      movie: bookingData.schedule.movie._id,

      hall: bookingData.schedule.hall._id,

      seats: bookingData.seats,

      showDate: bookingData.schedule.showDate,

      showTime: bookingData.schedule.showTime,

      amount: bookingData.totalAmount,

      qrCode: ticketNumber,

      ticketStatus: "Valid",
    });

    // =====================================
    // UPDATE BOOKING
    // =====================================

    bookingData.ticketGenerated = true;

    await bookingData.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("customer")
      .populate("movie")
      .populate("hall")
      .populate("booking");

    return NextResponse.json(
      {
        success: true,
        message: "Ticket generated successfully.",
        ticket: populatedTicket,
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
