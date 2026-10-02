import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects, {
      status: 200,
    });
  } catch (error) {
    console.error("PROJECT GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Admin authentication
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    try {
      const decoded = verifyToken(token) as {
        id?: string;
        email?: string;
        role?: string;
      };

      if (decoded.role !== "admin") {
        return NextResponse.json(
          {
            success: false,
            error: "Admin access required",
          },
          {
            status: 403,
          }
        );
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired session",
        },
        {
          status: 401,
        }
      );
    }

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
        {
          status: 400,
        }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Project description is required",
        },
        {
          status: 400,
        }
      );
    }

    const project = await prisma.project.create({
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
      status: 201,
    });
  } catch (error) {
    console.error("PROJECT POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      {
        status: 500,
      }
    );
  }
}