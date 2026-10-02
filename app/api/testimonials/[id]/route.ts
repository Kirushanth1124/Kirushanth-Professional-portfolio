import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = verifyToken(token) as {
      role?: string;
    };

    if (decoded.role !== "admin") {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Admin access required" },
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
        { error: "Invalid or expired session" },
        { status: 401 }
      ),
    };
  }
}

const allowedStatuses = [
  "pending",
  "approved",
  "rejected",
];

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const auth = checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const { id } = await context.params;

    const testimonial =
      await prisma.testimonial.findUnique({
        where: {
          id,
        },
      });

    if (!testimonial) {
      return NextResponse.json(
        {
          error: "Testimonial not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error(
      "TESTIMONIAL GET BY ID ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load testimonial",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const auth = checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const { id } = await context.params;

    const existing =
      await prisma.testimonial.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Testimonial not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await req.json();

    const {
      name,
      role,
      company,
      review,
      imageUrl,
      status,
      featured,
    } = body;

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          error: "Invalid testimonial status",
        },
        {
          status: 400,
        }
      );
    }

    const testimonial =
      await prisma.testimonial.update({
        where: {
          id,
        },
        data: {
          ...(name !== undefined && {
            name: String(name).trim(),
          }),

          ...(role !== undefined && {
            role: String(role).trim(),
          }),

          ...(company !== undefined && {
            company:
              String(company).trim() || null,
          }),

          ...(review !== undefined && {
            review: String(review).trim(),
          }),

          ...(imageUrl !== undefined && {
            imageUrl:
              String(imageUrl).trim() || null,
          }),

          ...(status !== undefined && {
            status,
          }),

          ...(featured !== undefined && {
            featured: Boolean(featured),
          }),
        },
      });

    return NextResponse.json({
      success: true,
      testimonial,
    });
  } catch (error) {
    console.error(
      "TESTIMONIAL UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update testimonial",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const auth = checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const { id } = await context.params;

    const existing =
      await prisma.testimonial.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Testimonial not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.testimonial.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error(
      "TESTIMONIAL DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete testimonial",
      },
      {
        status: 500,
      }
    );
  }
}