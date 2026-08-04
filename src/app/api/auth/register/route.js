import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { registerUser } from "@/services/authService";
import { validateRegister } from "@/validators/authValidator";

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();

    const error = validateRegister(body);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error,
        },
        {
          status: 400,
        },
      );
    }

    const result = await registerUser(body);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        token: result.token,
        user: result.user,
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
