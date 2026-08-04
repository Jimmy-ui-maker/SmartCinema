import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Ticket from "@/models/Ticket";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET SINGLE TICKET
// ==========================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
    }

    const ticket = await Ticket.findById(params.id)

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
      });

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

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
// UPDATE TICKET STATUS
// VALIDATE / CANCEL
// ==========================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin", "Cashier"]);

    if (user instanceof Response) {
      return user;
    }

    const body = await request.json();

    const { ticketStatus } = body;

    const allowedStatus = ["Valid", "Used", "Expired", "Cancelled"];

    if (!allowedStatus.includes(ticketStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ticket status",
        },

        {
          status: 400,
        },
      );
    }

    const ticket = await Ticket.findByIdAndUpdate(
      params.id,

      {
        ticketStatus,
      },

      {
        new: true,
      },
    );

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Ticket updated successfully",

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
