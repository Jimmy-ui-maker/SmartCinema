import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Booking from "@/models/Booking";
import Schedule from "@/models/Schedule";
import Ticket from "@/models/Ticket";

import { authMiddleware } from "@/middleware/authMiddleware";

// ======================================
// GET BOOKINGS
// ADMIN / CASHIER / CUSTOMER
// ======================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await authMiddleware(request);

    console.log("AUTH DECODED USER:", user);

    if (user instanceof Response) {
      return user;
    }

    let query = {};

    // Customer sees only own bookings

    if (user.role === "Customer") {
      query.customer = user.id;
    }

    const bookings = await Booking.find(query)
      .populate("customer")
      .populate({
        path: "schedule",
        populate: [{ path: "movie" }, { path: "hall" }],
      })
      .sort({ createdAt: -1 });

    const bookingIds = bookings.map((b) => b._id);

    const tickets = await Ticket.find({
      booking: { $in: bookingIds },
    });

    const bookingsWithTickets = bookings.map((booking) => {
      const ticket = tickets.find(
        (t) => t.booking.toString() === booking._id.toString(),
      );

      return {
        ...booking.toObject(),
        ticketGenerated: !!ticket,
        ticket,
      };
    });

    return NextResponse.json({
      success: true,
      bookings: bookingsWithTickets,
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
// CREATE BOOKING
// CUSTOMER ONLY
// ======================================

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
          message: "Only customers can create bookings",
        },

        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const {
      schedule,

      seats,
    } = body;

    const currentSchedule = await Schedule.findById(schedule);

    if (!currentSchedule) {
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

    const alreadyBooked = seats.some((seat) =>
      currentSchedule.bookedSeats.includes(seat),
    );

    if (alreadyBooked) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more seats already booked",
        },

        {
          status: 400,
        },
      );
    }

    const totalAmount = seats.length * currentSchedule.ticketPrice;

    const bookingNumber = "CIN-" + Date.now();

    const booking = await Booking.create({
      bookingNumber,

      customer: user.id,

      schedule,

      seats,

      totalAmount,

      bookingStatus: "Reserved",
    });

    currentSchedule.bookedSeats.push(...seats);

    await currentSchedule.save();

    return NextResponse.json(
      {
        success: true,

        message: "Booking created successfully",

        booking,
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
