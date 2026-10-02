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

// PUBLIC
export async function GET() {
  try {
    const certificates =
      await prisma.certificate.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(certificates, {
      status: 200,
    });
  } catch (error) {
    console.error("CERTIFICATE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load certificates",
      },
      { status: 500 }
    );
  }
}

// ADMIN ONLY
export async function POST(req: NextRequest) {
  try {
    const auth = checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const body = await req.json();

    const {
      title,
      issuer,
      issuedDate,
      credential,
      imageUrl,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Certificate title is required",
        },
        { status: 400 }
      );
    }

    if (!issuer?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Issuer is required",
        },
        { status: 400 }
      );
    }

    if (!issuedDate?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Issued date is required",
        },
        { status: 400 }
      );
    }

    const certificate =
      await prisma.certificate.create({
        data: {
          title: title.trim(),
          issuer: issuer.trim(),
          issuedDate: issuedDate.trim(),

          credential:
            typeof credential === "string" &&
            credential.trim()
              ? credential.trim()
              : null,

          imageUrl:
            typeof imageUrl === "string" &&
            imageUrl.trim()
              ? imageUrl.trim()
              : null,
        },
      });

    return NextResponse.json(certificate, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "CERTIFICATE POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create certificate",
      },
      { status: 500 }
    );
  }
}