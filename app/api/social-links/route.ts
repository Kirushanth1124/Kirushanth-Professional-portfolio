import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function checkAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = verifyToken(token) as {
      id?: string;
      email?: string;
      role?: string;
    };

    if (decoded.role !== "admin") {
      return {
        ok: false,
        response: NextResponse.json(
          { success: false, error: "Admin access required" },
          { status: 403 }
        ),
      };
    }

    return { ok: true, response: null };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 }
      ),
    };
  }
}

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(links, {
      status: 200,
    });
  } catch (error) {
    console.error("SOCIAL LINKS GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load social links",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const body = await req.json();

    const { platform, url, icon } = body;

    if (!platform?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Platform is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!url?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "URL is required",
        },
        {
          status: 400,
        }
      );
    }

    const socialLink = await prisma.socialLink.create({
      data: {
        platform: platform.trim(),
        url: url.trim(),
        icon:
          typeof icon === "string" && icon.trim()
            ? icon.trim()
            : null,
      },
    });

    return NextResponse.json(socialLink, {
      status: 201,
    });
  } catch (error) {
    console.error("SOCIAL LINK POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create social link",
      },
      {
        status: 500,
      }
    );
  }
}