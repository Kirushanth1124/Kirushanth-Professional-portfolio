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

    const {
      title,
      issuer,
      issuedDate,
      credential,
      imageUrl,
    } = body;

    if (
      !title?.trim() ||
      !issuer?.trim() ||
      !issuedDate?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Title, issuer and issued date are required",
        },
        { status: 400 }
      );
    }

    const certificate =
      await prisma.certificate.update({
        where: { id },

        data: {
          title: title.trim(),
          issuer: issuer.trim(),
          issuedDate: issuedDate.trim(),

          credential:
            credential?.trim() || null,

          imageUrl:
            imageUrl?.trim() || null,
        },
      });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error(
      "CERTIFICATE UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update certificate",
      },
      { status: 500 }
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

    await prisma.certificate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error(
      "CERTIFICATE DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete certificate",
      },
      { status: 500 }
    );
  }
}