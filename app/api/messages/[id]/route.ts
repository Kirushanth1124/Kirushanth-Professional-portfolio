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

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        isRead: Boolean(body.isRead),
      },
    });

    return NextResponse.json(updatedMessage, {
      status: 200,
    });
  } catch (error) {
    console.error("MESSAGE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update message",
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

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("MESSAGE DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete message",
      },
      {
        status: 500,
      }
    );
  }
}