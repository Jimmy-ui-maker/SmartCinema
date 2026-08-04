import { NextResponse } from "next/server";

import { authMiddleware } from "./authMiddleware";

export async function roleMiddleware(request, allowedRoles = []) {
  const user = await authMiddleware(request);

  if (user instanceof Response) {
    return user;
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      {
        success: false,
        message: "You do not have permission",
      },

      {
        status: 403,
      },
    );
  }

  return user;
}
