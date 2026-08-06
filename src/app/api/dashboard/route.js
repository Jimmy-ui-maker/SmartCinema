import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Movie from "@/models/Movie";
import Genre from "@/models/Genre";
import Hall from "@/models/Hall";
import Schedule from "@/models/Schedule";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import Ticket from "@/models/Ticket";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDB();

    const [
      movies,
      genres,
      halls,
      schedules,
      bookings,
      payments,
      tickets,
      customers,
    ] = await Promise.all([
      Movie.countDocuments(),
      Genre.countDocuments(),
      Hall.countDocuments(),
      Schedule.countDocuments(),
      Booking.countDocuments(),
      Payment.countDocuments(),
      Ticket.countDocuments(),
      User.countDocuments({
        role: "Customer",
      }),
    ]);

    return NextResponse.json(
      {
        success: true,

        stats: {
          movies,
          genres,
          halls,
          schedules,
          bookings,
          payments,
          tickets,
          customers,
        },
      },
      {
        status: 200,
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
