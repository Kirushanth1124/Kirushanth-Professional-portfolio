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

// UPDATE
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Experience ID is missing",
        },
        {
          status: 400,
        }
      );
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

    const updated = await prisma.experience.update({
      where: {
        id,
      },

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

    return NextResponse.json(updated, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "EXPERIENCE UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update experience",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Experience ID is missing",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.experience.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Experience deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "EXPERIENCE DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete experience",
      },
      {
        status: 500,
      }
    );
  }
}