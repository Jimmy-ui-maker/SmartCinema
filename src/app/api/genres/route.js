import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Genre from "@/models/Genre";

// =================================
// GET ALL GENRES
// =================================

export async function GET() {
  try {
    await connectToDB();

    const genres = await Genre.find().sort({
      name: 1,
    });

    return NextResponse.json(
      {
        success: true,
        genres,
      },

      {
        status: 200,
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

// =================================
// CREATE GENRE
// ADMIN ONLY LATER
// =================================

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();

    const genre = await Genre.create({
      name: body.name,

      description: body.description,

      image: body.image,
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
