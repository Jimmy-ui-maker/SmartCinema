import bcrypt from "bcryptjs";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import connectToDB from "@/lib/db";

export async function POST(request) {
  try {
    await connectToDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        {
          status: 400,
        },
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        },
      );
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        },
      );
    }

    const token = generateToken({
      id: user._id,

      role: user.role,
    });

    return Response.json(
      {
        success: true,

        message: "Login successful.",

        token,

        user: {
  id: user._id.toString(),

  firstName: user.firstName,

  lastName: user.lastName,

  name: `${user.firstName} ${user.lastName}`,

  email: user.email,

  role: user.role,

  profilePicture: user.profilePicture,
},
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return Response.json(
      {
        success: false,

        message: error.message || "Something went wrong during login.",
      },
      {
        status: 500,
      },
    );
  }
}
