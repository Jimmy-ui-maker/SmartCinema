import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Hall from "@/models/Hall";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET ALL HALLS
// ADMIN
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

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

// ==========================================
// CREATE HALL
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

    const { name, rows, seatsPerRow, status } = body;

    // ===============================
    // GENERATE SEATS
    // ===============================

    const generatedSeats = [];

    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i);

      for (let j = 1; j <= seatsPerRow; j++) {
        generatedSeats.push({
          row: rowLetter,

          number: j,
        });
      }
    }

    const hall = await Hall.create({
      name,

      capacity: generatedSeats.length,

      seats: generatedSeats,

      status: status || "Available",
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
