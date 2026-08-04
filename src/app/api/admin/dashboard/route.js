import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import { roleMiddleware } from "@/middleware/roleMiddleware";

import User from "@/models/User";
import Movie from "@/models/Movie";
import Hall from "@/models/Hall";
import Schedule from "@/models/Schedule";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import Ticket from "@/models/Ticket";

// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    // ================================
    // CHECK ADMIN
    // ================================

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    // ================================
    // COUNTS
    // ================================

    const totalUsers = await User.countDocuments();

    const totalCustomers = await User.countDocuments({
      role: "Customer",
    });

    const totalMovies = await Movie.countDocuments();

    const totalHalls = await Hall.countDocuments();

    const totalSchedules = await Schedule.countDocuments();

    const totalBookings = await Booking.countDocuments();

    const totalTickets = await Ticket.countDocuments();

    // ================================
    // PAYMENTS
    // ================================

    const totalRevenue = await Payment.aggregate([
      {
        $match: {
          paymentStatus: "Verified",
        },
      },

      {
        $group: {
          _id: null,

          amount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const pendingPayments = await Payment.countDocuments({
      paymentStatus: "Submitted",
    });

    const confirmedPayments = await Payment.countDocuments({
      paymentStatus: "Verified",
    });

    // ================================
    // RECENT BOOKINGS
    // ================================

    const recentBookings = await Booking.find()

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
      })

      .sort({
        createdAt: -1,
      })

      .limit(5);

    return NextResponse.json({
      success: true,

      dashboard: {
        users: {
          total: totalUsers,

          customers: totalCustomers,
        },

        movies: totalMovies,

        halls: totalHalls,

        schedules: totalSchedules,

        bookings: totalBookings,

        tickets: totalTickets,

        payments: {
          revenue: totalRevenue[0]?.amount || 0,

          pending: pendingPayments,

          confirmed: confirmedPayments,
        },

        recentBookings,
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
