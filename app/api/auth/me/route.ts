import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        {
          status: 401,
        }
      );
    }

    const decoded = verifyToken(token) as {
      id?: string;
      email?: string;
      role?: string;
      name?: string;
    };

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "AUTH ME ERROR:",
      error
    );

    return NextResponse.json(
      {
        authenticated: false,
        error: "Invalid or expired session",
      },
      {
        status: 401,
      }
    );
  }
}