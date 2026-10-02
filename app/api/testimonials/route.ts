import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* =========================
   BASIC RATE LIMIT
========================= */

const RATE_LIMIT_WINDOW =
  60 * 1000; // 1 minute

const RATE_LIMIT_MAX = 2;

const testimonialRateLimit = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

function getClientIp(
  req: NextRequest
) {
  const forwarded =
    req.headers.get(
      "x-forwarded-for"
    );

  if (forwarded) {
    return forwarded
      .split(",")[0]
      .trim();
  }

  return (
    req.headers.get(
      "x-real-ip"
    ) || "unknown"
  );
}

function checkRateLimit(
  ip: string
) {
  const now = Date.now();

  const current =
    testimonialRateLimit.get(ip);

  if (
    !current ||
    now > current.resetAt
  ) {
    testimonialRateLimit.set(
      ip,
      {
        count: 1,
        resetAt:
          now +
          RATE_LIMIT_WINDOW,
      }
    );

    return true;
  }

  if (
    current.count >=
    RATE_LIMIT_MAX
  ) {
    return false;
  }

  current.count += 1;

  testimonialRateLimit.set(
    ip,
    current
  );

  return true;
}

/* =========================
   HELPERS
========================= */

function isAdmin(
  req: NextRequest
) {
  const token =
    req.cookies.get(
      "admin_token"
    )?.value;

  if (!token) {
    return false;
  }

  try {
    const decoded =
      verifyToken(
        token
      ) as {
        role?: string;
      };

    return (
      decoded.role ===
      "admin"
    );
  } catch {
    return false;
  }
}

function isValidHttpUrl(
  value: string
) {
  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        "http:" ||
      url.protocol ===
        "https:"
    );
  } catch {
    return false;
  }
}

/* =========================
   GET TESTIMONIALS
========================= */

export async function GET(
  req: NextRequest
) {
  try {
    const {
      searchParams,
    } = new URL(req.url);

    const adminMode =
      searchParams.get(
        "admin"
      ) === "true";

    /* Admin - all testimonials */
    if (adminMode) {
      if (!isAdmin(req)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Unauthorized",
          },
          {
            status: 401,
          }
        );
      }

      const testimonials =
        await prisma.testimonial.findMany(
          {
            orderBy: {
              createdAt:
                "desc",
            },
          }
        );

      return NextResponse.json(
        testimonials,
        {
          status: 200,
        }
      );
    }

    /* Public - approved only */
    const testimonials =
      await prisma.testimonial.findMany(
        {
          where: {
            status:
              "approved",
          },

          orderBy: [
            {
              featured:
                "desc",
            },
            {
              createdAt:
                "desc",
            },
          ],
        }
      );

    return NextResponse.json(
      testimonials,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "TESTIMONIAL GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load testimonials",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   PUBLIC SUBMISSION
========================= */

export async function POST(
  req: NextRequest
) {
  try {
    /* Rate limit */
    const ip =
      getClientIp(req);

    if (
      !checkRateLimit(ip)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many testimonial submissions. Please wait a moment and try again.",
        },
        {
          status: 429,
        }
      );
    }

    const body =
      await req.json();

    const {
      name,
      role,
      company,
      review,
      imageUrl,

      // Honeypot field
      website,
    } = body;

    /* Bot trap */
    if (
      typeof website ===
        "string" &&
      website.trim()
    ) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Testimonial submitted successfully.",
        },
        {
          status: 201,
        }
      );
    }

    /* Type validation */
    if (
      typeof name !==
      "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid name",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof role !==
      "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid role",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof review !==
      "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid review",
        },
        {
          status: 400,
        }
      );
    }

    const cleanName =
      name.trim();

    const cleanRole =
      role.trim();

    const cleanCompany =
      typeof company ===
      "string"
        ? company.trim()
        : "";

    const cleanReview =
      review.trim();

    const cleanImageUrl =
      typeof imageUrl ===
      "string"
        ? imageUrl.trim()
        : "";

    /* Required fields */
    if (!cleanName) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!cleanRole) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Role is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!cleanReview) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Review is required",
        },
        {
          status: 400,
        }
      );
    }

    /* Length validation */
    if (
      cleanName.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name is too long",
        },
        {
          status: 400,
        }
      );
    }

    if (
      cleanRole.length > 120
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Role is too long",
        },
        {
          status: 400,
        }
      );
    }

    if (
      cleanCompany.length >
      150
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Company name is too long",
        },
        {
          status: 400,
        }
      );
    }

    if (
      cleanReview.length >
      1000
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Testimonial must be 1000 characters or less",
        },
        {
          status: 400,
        }
      );
    }

    /* Optional image URL */
    if (
      cleanImageUrl &&
      !isValidHttpUrl(
        cleanImageUrl
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid image URL",
        },
        {
          status: 400,
        }
      );
    }

    /* Save as pending only */
    const testimonial =
      await prisma.testimonial.create(
        {
          data: {
            name:
              cleanName,

            role:
              cleanRole,

            company:
              cleanCompany ||
              null,

            review:
              cleanReview,

            imageUrl:
              cleanImageUrl ||
              null,

            status:
              "pending",

            featured:
              false,
          },
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Testimonial submitted successfully and is waiting for approval.",

        id:
          testimonial.id,

        status:
          testimonial.status,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "TESTIMONIAL POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to submit testimonial",
      },
      {
        status: 500,
      }
    );
  }
}