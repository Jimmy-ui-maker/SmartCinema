import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Ticket from "@/models/Ticket";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET ALL TICKETS
// ADMIN / CASHIER
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
    }

    const tickets = await Ticket.find()

      .populate({
        path: "booking",

        populate: [
          {
            path: "customer",
            select: "firstName lastName email phone",
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
