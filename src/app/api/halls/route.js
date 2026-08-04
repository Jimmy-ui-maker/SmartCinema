import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Hall from "@/models/Hall";

// =================================
// GET ALL HALLS
// =================================

export async function GET() {
  try {
    await connectToDB();

    const halls = await Hall.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,

      halls,
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

// =================================
// CREATE HALL
// AUTO GENERATE SEATS
// =================================

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();

    const {
      name,

      capacity,

      rows,

      seatsPerRow,
    } = body;

    let seats = [];

    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= seatsPerRow; j++) {
        seats.push({
          row: rows[i],

          number: j,
        });
      }
    }

    const hall = await Hall.create({
      name,

      capacity,

      seats,
    });

    return NextResponse.json(
      {
        success: true,

        message: "Hall created successfully",

        hall,
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
