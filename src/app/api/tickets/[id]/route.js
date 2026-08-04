import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Ticket from "@/models/Ticket";

import { authMiddleware } from "@/middleware/authMiddleware";

// =====================================
// GET SINGLE TICKET
// =====================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const user = await authMiddleware(request);

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

    // CUSTOMER CAN ONLY SEE OWN TICKET

    if (
      user.role === "Customer" &&
      ticket.booking.customer._id.toString() !== user.id
    ) {
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

// =====================================
// UPDATE TICKET STATUS
// USED / CANCELLED
// =====================================

export async function PUT(request, { params }) {
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
          message: "Only staff can update tickets",
        },

        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const ticket = await Ticket.findByIdAndUpdate(
      params.id,

      {
        ticketStatus: body.ticketStatus,
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
