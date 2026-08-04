import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import User from "@/models/User";
import Movie from "@/models/Movie";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import Ticket from "@/models/Ticket";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// CINEMA REPORTS
// ADMIN ONLY
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    // ===============================
    // BASIC COUNTS
    // ===============================

    const totalCustomers = await User.countDocuments({
      role: "Customer",
    });

    const totalMovies = await Movie.countDocuments();

    const totalBookings = await Booking.countDocuments();

    const totalTickets = await Ticket.countDocuments();

    // ===============================
    // REVENUE
    // ===============================

    const payments = await Payment.find({
      paymentStatus: "Verified",
    });

    const totalRevenue = payments.reduce(
      (total, payment) => {
        return total + payment.amount;
      },

      0,
    );

    // ===============================
    // TODAY SALES
    // ===============================

    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),

      today.getMonth(),

      today.getDate(),
    );

    const endOfDay = new Date(
      today.getFullYear(),

      today.getMonth(),

      today.getDate() + 1,
    );

    const todayPayments = await Payment.find({
      paymentStatus: "Verified",

      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const todayRevenue = todayPayments.reduce(
      (total, payment) => {
        return total + payment.amount;
      },

      0,
    );

    // ===============================
    // BOOKING STATUS
    // ===============================

    const bookingStatus = await Booking.aggregate([
      {
        $group: {
          _id: "$bookingStatus",

          count: {
            $count: {},
          },
        },
      },
    ]);

    // ===============================
    // PAYMENT STATUS
    // ===============================

    const paymentStatus = await Payment.aggregate([
      {
        $group: {
          _id: "$paymentStatus",

          count: {
            $count: {},
          },
        },
      },
    ]);

    // ===============================
    // POPULAR MOVIES
    // ===============================

    const popularMovies = await Booking.aggregate([
      {
        $lookup: {
          from: "schedules",

          localField: "schedule",

          foreignField: "_id",

          as: "schedule",
        },
      },

      {
        $unwind: "$schedule",
      },

      {
        $lookup: {
          from: "movies",

          localField: "schedule.movie",

          foreignField: "_id",

          as: "movie",
        },
      },

      {
        $unwind: "$movie",
      },

      {
        $group: {
          _id: "$movie._id",

          title: {
            $first: "$movie.title",
          },

          totalBookings: {
            $count: {},
          },
        },
      },

      {
        $sort: {
          totalBookings: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    return NextResponse.json({
      success: true,

      reports: {
        customers: {
          total: totalCustomers,
        },

        movies: {
          total: totalMovies,
        },

        bookings: {
          total: totalBookings,
        },

        tickets: {
          total: totalTickets,
        },

        revenue: {
          total: totalRevenue,

          today: todayRevenue,
        },

        bookingStatus,

        paymentStatus,

        popularMovies,
      },
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
