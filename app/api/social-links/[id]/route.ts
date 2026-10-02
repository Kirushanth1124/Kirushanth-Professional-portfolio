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

    const { platform, url, icon } = body;

    const updated = await prisma.socialLink.update({
      where: { id },
      data: {
        platform: platform?.trim(),
        url: url?.trim(),
        icon:
          typeof icon === "string" && icon.trim()
            ? icon.trim()
            : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("SOCIAL LINK UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update social link",
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

    await prisma.socialLink.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Social link deleted successfully",
    });
  } catch (error) {
    console.error("SOCIAL LINK DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete social link",
      },
      {
        status: 500,
      }
    );
  }
}