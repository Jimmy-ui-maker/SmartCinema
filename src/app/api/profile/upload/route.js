import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";
import User from "@/models/User";

import { authMiddleware } from "@/middleware/authMiddleware";

import { uploadToCloudinary } from "@/lib/cloudinary";

// ======================================
// UPLOAD PROFILE PICTURE
// ======================================

export async function POST(request) {
  try {
    await connectToDB();

    const user = await authMiddleware(request);

    if (user instanceof Response) {
      return user;
    }

    const formData = await request.formData();

    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select an image.",
        },
        {
          status: 400,
        },
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const upload = await uploadToCloudinary(buffer, {
      folder: "cinemahub/profile",
    });

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        profilePicture: upload.secure_url,
      },
      {
        new: true,
      },
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile picture updated successfully.",
      image: upload.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

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
