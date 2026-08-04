import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Schedule from "@/models/Schedule";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET ALL SCHEDULES
// ADMIN
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const schedules = await Schedule.find()

      .populate("movie")

      .populate("hall")

      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,

      schedules,
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
// CREATE SCHEDULE
// ADMIN
// ==========================================

export async function POST(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const body = await request.json();

    const {
      movie,

      hall,

      showDate,

      showTime,

      ticketPrice,
    } = body;

    const schedule = await Schedule.create({
      movie,

      hall,

      showDate,

      showTime,

      ticketPrice,

      bookedSeats: [],

      status: "Scheduled",
    });

    const populatedSchedule = await Schedule.findById(schedule._id)

      .populate("movie")

      .populate("hall");

    return NextResponse.json(
      {
        success: true,

        message: "Schedule created successfully",

        schedule: populatedSchedule,
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
