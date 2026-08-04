import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Schedule from "@/models/Schedule";

// Register models for populate()
import "@/models/Movie";
import "@/models/Hall";

// =====================================
// GET ALL SCHEDULES
// =====================================

export async function GET() {
  try {
    await connectToDB();

    const schedules = await Schedule.find()
      .populate("movie")
      .populate("hall")
      .sort({
        showDate: 1,
        showTime: 1,
      });

    return NextResponse.json({
      success: true,
      schedules,
    });
  } catch (error) {
    console.error(error);

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
// CREATE SCHEDULE
// =====================================

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();

    const schedule = await Schedule.create({
      movie: body.movie,
      hall: body.hall,
      showDate: body.showDate,
      showTime: body.showTime,
      ticketPrice: body.ticketPrice,
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
    console.error(error);

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
