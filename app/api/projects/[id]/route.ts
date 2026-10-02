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
      title,
      description,
      techStack,
      githubUrl,
      liveUrl,
      imageUrl,
      featured,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Project title is required",
        },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Project description is required",
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: {
        id,
      },

      data: {
        title: title.trim(),

        description: description.trim(),

        techStack:
          typeof techStack === "string" &&
          techStack.trim()
            ? techStack.trim()
            : null,

        githubUrl:
          typeof githubUrl === "string" &&
          githubUrl.trim()
            ? githubUrl.trim()
            : null,

        liveUrl:
          typeof liveUrl === "string" &&
          liveUrl.trim()
            ? liveUrl.trim()
            : null,

        imageUrl:
          typeof imageUrl === "string" &&
          imageUrl.trim()
            ? imageUrl.trim()
            : null,

        featured: Boolean(featured),
      },
    });

    return NextResponse.json(project, {
      status: 200,
    });
  } catch (error) {
    console.error("PROJECT UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project",
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

    await prisma.project.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("PROJECT DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete project",
      },
      {
        status: 500,
      }
    );
  }
}