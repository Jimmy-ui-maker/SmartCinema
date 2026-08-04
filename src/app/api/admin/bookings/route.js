import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Booking from "@/models/Booking";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET ALL BOOKINGS
// ADMIN / CASHIER
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
    }

    const bookings = await Booking.find()

      .populate("customer", "-password")

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
      });

    return NextResponse.json({
      success: true,

      bookings,
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
