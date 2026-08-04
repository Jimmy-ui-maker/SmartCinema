import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Ticket from "@/models/Ticket";
import Booking from "@/models/Booking";
import Schedule from "@/models/Schedule";
import "@/models/Movie";
import "@/models/Hall";

import { authMiddleware } from "@/middleware/authMiddleware";

// =====================================
// SCAN TICKET
// =====================================

export async function POST(request) {
  try {
    await connectToDB();

    const user = await authMiddleware(request);

    if (user instanceof Response) {
      return user;
    }

    // Only Admin or Cashier (Gate Attendant)
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

    const body = await request.json();

    const { ticketId, ticketNumber } = body;

    if (!ticketId && !ticketNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket information is required.",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================
    // FIND TICKET
    // =====================================

    let ticket;

    if (ticketId) {
      ticket = await Ticket.findById(ticketId);
    } else {
      ticket = await Ticket.findOne({
        ticketNumber,
      });
    }

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ticket.",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================
    // LOAD BOOKING
    // =====================================

    const booking = await Booking.findById(ticket.booking)

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
      })
      .populate("customer");

    if (!booking.schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Schedule not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================
    // PAYMENT CHECK
    // =====================================

    if (booking.paymentStatus !== "Paid") {
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
    // BOOKING STATUS
    // =====================================

    if (booking.bookingStatus !== "Confirmed") {
      return NextResponse.json(
        {
          success: false,
          message: "Booking is not confirmed.",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================
    // TICKET STATUS
    // =====================================

    if (ticket.ticketStatus === "Used") {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket has already been used.",
        },
        {
          status: 400,
        },
      );
    }

    if (ticket.ticketStatus === "Cancelled") {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket has been cancelled.",
        },
        {
          status: 400,
        },
      );
    }

    if (ticket.ticketStatus === "Expired") {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket has expired.",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================
    // MARK USED
    // =====================================

    await Ticket.findByIdAndUpdate(
      ticket._id,
      {
        ticketStatus: "Used",
      },
      {
        new: true,
      },
    );

    ticket.ticketStatus = "Used";

    // =====================================
    // SUCCESS
    // =====================================

    return NextResponse.json({
      success: true,
      message: "Ticket verified successfully. Welcome!",

      ticket: {
        id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        ticketStatus: ticket.ticketStatus,
      },

      booking: {
        bookingNumber: booking.bookingNumber,
        seats: booking.seats,
        amount: booking.totalAmount,
      },

      customer: {
        id: booking.customer._id,
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
        email: booking.customer.email,
      },

      movie: {
        title: booking.schedule.movie.title,
      },

      hall: {
        name: booking.schedule.hall.name,
      },

      schedule: {
        showDate: booking.schedule.showDate,
        showTime: booking.schedule.showTime,
      },
    });
  } catch (error) {
    console.error("SCAN ERROR:", error);

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
