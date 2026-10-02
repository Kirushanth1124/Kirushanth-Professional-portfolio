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

// PUBLIC
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();

    return NextResponse.json(
      settings || {},
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "SITE SETTINGS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load site settings",
      },
      {
        status: 500,
      }
    );
  }
}

// ADMIN ONLY
export async function PUT(req: NextRequest) {
  try {
    const auth = checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const body = await req.json();

    const {
      siteName,
      heroTitle,
      heroSubtitle,
      aboutText,
      profileImage,
      resumeUrl,
    } = body;

    const existing =
      await prisma.siteSettings.findFirst();

    let settings;

    if (existing) {
      settings =
        await prisma.siteSettings.update({
          where: {
            id: existing.id,
          },

          data: {
            siteName:
              typeof siteName === "string" &&
              siteName.trim()
                ? siteName.trim()
                : null,

            heroTitle:
              typeof heroTitle === "string" &&
              heroTitle.trim()
                ? heroTitle.trim()
                : null,

            heroSubtitle:
              typeof heroSubtitle === "string" &&
              heroSubtitle.trim()
                ? heroSubtitle.trim()
                : null,

            aboutText:
              typeof aboutText === "string" &&
              aboutText.trim()
                ? aboutText.trim()
                : null,

            profileImage:
              typeof profileImage === "string" &&
              profileImage.trim()
                ? profileImage.trim()
                : null,

            resumeUrl:
              typeof resumeUrl === "string" &&
              resumeUrl.trim()
                ? resumeUrl.trim()
                : null,
          },
        });
    } else {
      settings =
        await prisma.siteSettings.create({
          data: {
            siteName:
              typeof siteName === "string" &&
              siteName.trim()
                ? siteName.trim()
                : null,

            heroTitle:
              typeof heroTitle === "string" &&
              heroTitle.trim()
                ? heroTitle.trim()
                : null,

            heroSubtitle:
              typeof heroSubtitle === "string" &&
              heroSubtitle.trim()
                ? heroSubtitle.trim()
                : null,

            aboutText:
              typeof aboutText === "string" &&
              aboutText.trim()
                ? aboutText.trim()
                : null,

            profileImage:
              typeof profileImage === "string" &&
              profileImage.trim()
                ? profileImage.trim()
                : null,

            resumeUrl:
              typeof resumeUrl === "string" &&
              resumeUrl.trim()
                ? resumeUrl.trim()
                : null,
          },
        });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Site settings updated successfully",
        data: settings,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "SITE SETTINGS UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update site settings",
      },
      {
        status: 500,
      }
    );
  }
}