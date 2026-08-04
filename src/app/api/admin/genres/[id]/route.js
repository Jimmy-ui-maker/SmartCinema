import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";

import Genre from "@/models/Genre";

import { roleMiddleware } from "@/middleware/roleMiddleware";

// ==========================================
// GET SINGLE GENRE
// ==========================================

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const genre = await Genre.findById(params.id);

    if (!genre) {
      return NextResponse.json(
        {
          success: false,
          message: "Genre not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      genre,
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
// UPDATE GENRE
// ==========================================

export async function PUT(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const body = await request.json();

    const genre = await Genre.findByIdAndUpdate(
      params.id,

      body,

      {
        new: true,
      },
    );

    if (!genre) {
      return NextResponse.json(
        {
          success: false,
          message: "Genre not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Genre updated successfully",

      genre,
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
// DELETE GENRE
// ==========================================

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const user = await roleMiddleware(request, ["Admin"]);

    if (user instanceof Response) {
      return user;
    }

    const genre = await Genre.findByIdAndDelete(params.id);

    if (!genre) {
      return NextResponse.json(
        {
          success: false,
          message: "Genre not found",
        },

        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Genre deleted successfully",
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
