import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function checkAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
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
          {
            success: false,
            error: "Admin access required",
          },
          { status: 403 }
        ),
      };
    }

    return {
      ok: true,
      response: null,
    };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Invalid or expired session",
        },
        { status: 401 }
      ),
    };
  }
}

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(experiences, {
      status: 200,
    });
  } catch (error) {
    console.error("EXPERIENCE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experiences",
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

    const {
      year,
      title,
      company,
      location,
      description,
    } = body;

    if (!year?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Year is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!company?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Company is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Description is required",
        },
        {
          status: 400,
        }
      );
    }

    const experience = await prisma.experience.create({
      data: {
        year: year.trim(),
        title: title.trim(),
        company: company.trim(),

        location:
          typeof location === "string" &&
          location.trim()
            ? location.trim()
            : null,

        description: description.trim(),
      },
    });

    return NextResponse.json(experience, {
      status: 201,
    });
  } catch (error) {
    console.error("EXPERIENCE POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create experience",
      },
      {
        status: 500,
      }
    );
  }
}