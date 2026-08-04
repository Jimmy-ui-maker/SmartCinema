import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Movie from "@/models/Movie";

// ================================
// GET SINGLE MOVIE
// ================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const movie = await Movie.findById(params.id).populate("genre");

    if (!movie) {
      return NextResponse.json(
        {
          success: false,
          message: "Movie not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      movie,
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

// ================================
// UPDATE MOVIE
// ================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const body = await request.json();

    const movie = await Movie.findByIdAndUpdate(
      params.id,

      body,

      {
        new: true,
      },
    );

    if (!movie) {
      return NextResponse.json(
        {
          success: false,
          message: "Movie not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Movie updated",
      movie,
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

// ================================
// DELETE MOVIE
// ================================

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const movie = await Movie.findByIdAndDelete(params.id);

    if (!movie) {
      return NextResponse.json(
        {
          success: false,
          message: "Movie not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Movie deleted",
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
