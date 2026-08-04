import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Movie from "@/models/Movie";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET ALL MOVIES
// ADMIN
// ==========================================

export async function GET(request) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const movies = await Movie.find()

      .populate("genre")

      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,

      movies,
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
// CREATE MOVIE
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

    const movie = await Movie.create({
      title: body.title,

      description: body.description,

      genre: body.genre,

      duration: body.duration,

      releaseDate: body.releaseDate,

      language: body.language,

      rating: body.rating,

      poster: body.poster,

      banner: body.banner,

      status: body.status || "Now Showing",
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
