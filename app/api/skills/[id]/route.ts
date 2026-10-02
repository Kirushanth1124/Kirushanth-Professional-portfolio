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

    const body = await req.json();

    const {
      name,
      category,
      level,
      icon,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Skill name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!category?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Category is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!level?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Level is required",
        },
        {
          status: 400,
        }
      );
    }

    const skill = await prisma.skill.update({
      where: {
        id,
      },

      data: {
        name: name.trim(),
        category: category.trim(),
        level: level.trim(),

        icon:
          typeof icon === "string" && icon.trim()
            ? icon.trim()
            : null,
      },
    });

    return NextResponse.json(skill, {
      status: 200,
    });
  } catch (error) {
    console.error("SKILL UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update skill",
      },
      {
        status: 500,
      }
    );
  }
}

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

    await prisma.skill.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Skill deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("SKILL DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete skill",
      },
      {
        status: 500,
      }
    );
  }
}