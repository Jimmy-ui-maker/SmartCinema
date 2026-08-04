import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Movie from "@/models/Movie";

// ================================
// GET ALL MOVIES
// ================================

export async function GET() {
  try {
    await connectToDB();

    const movies = await Movie.find().populate("genre").sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        movies,
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

// ================================
// CREATE MOVIE
// ADMIN ONLY (later middleware)
// ================================

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();

    const movie = await Movie.create({
      title: body.title,

      description: body.description,

      poster: body.poster,

      banner: body.banner,

      trailer: body.trailer,

      genre: body.genre,

      duration: body.duration,

      language: body.language,

      rating: body.rating,

      releaseDate: body.releaseDate,

      status: body.status,

      isFeatured: body.isFeatured,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Movie created successfully",
        movie,
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
