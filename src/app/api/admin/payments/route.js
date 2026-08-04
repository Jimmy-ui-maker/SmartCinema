import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Payment from "@/models/Payment";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET ALL PAYMENTS
// ADMIN / CASHIER
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
    }

    const payments = await Payment.find()

      .populate("customer", "-password")

      .populate({
        path: "booking",

        populate: [
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
