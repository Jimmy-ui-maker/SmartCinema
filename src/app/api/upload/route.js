import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

import { authMiddleware } from "@/middleware/authMiddleware";

export async function POST(request) {
  try {
    const user = await authMiddleware(request);

    if (user instanceof Response) {
      return user;
    }

    const formData = await request.formData();

    const file = formData.get("file");

    const folder = formData.get("folder") || "CinemaTicketingSystem/general";

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file selected",
        },

        {
          status: 400,
        },
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
          },

          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,

      message: "Upload successful",

      url: uploadResult.secure_url,

      public_id: uploadResult.public_id,
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
