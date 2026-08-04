import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Genre from "@/models/Genre";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET ALL GENRES
// ADMIN
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const genres = await Genre.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,

      genres,
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
// CREATE GENRE
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

    const genre = await Genre.create({
      name: body.name,

      description: body.description || "",
    });

    return NextResponse.json(
      {
        success: true,

        message: "Genre created successfully",

        genre,
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
