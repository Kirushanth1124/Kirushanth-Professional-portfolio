import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import {
  NextRequest,
  NextResponse,
} from "next/server";

/* =========================
   BASIC RATE LIMIT
========================= */

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 3;

const messageRateLimit = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

function getClientIp(req: NextRequest) {
  const forwarded =
    req.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded
      .split(",")[0]
      .trim();
  }

  return (
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string) {
  const now = Date.now();

  const current =
    messageRateLimit.get(ip);

  if (
    !current ||
    now > current.resetAt
  ) {
    messageRateLimit.set(ip, {
      count: 1,
      resetAt:
        now + RATE_LIMIT_WINDOW,
    });

    return true;
  }

  if (
    current.count >= RATE_LIMIT_MAX
  ) {
    return false;
  }

  current.count += 1;

  messageRateLimit.set(
    ip,
    current
  );

  return true;
}

/* =========================
   EMAIL VALIDATION
========================= */

function isValidEmail(
  email: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

/* =========================
   ADMIN AUTH
========================= */

function checkAdmin(
  req: NextRequest
) {
  const token =
    req.cookies.get(
      "admin_token"
    )?.value;

  if (!token) {
    return {
      ok: false,
      response:
        NextResponse.json(
          {
            success: false,
            error:
              "Unauthorized",
          },
          {
            status: 401,
          }
        ),
    };
  }

  try {
    const decoded =
      verifyToken(
        token
      ) as {
        id?: string;
        email?: string;
        role?: string;
      };

    if (
      decoded.role !==
      "admin"
    ) {
      return {
        ok: false,
        response:
          NextResponse.json(
            {
              success: false,
              error:
                "Admin access required",
            },
            {
              status: 403,
            }
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
      response:
        NextResponse.json(
          {
            success: false,
            error:
              "Invalid or expired session",
          },
          {
            status: 401,
          }
        ),
    };
  }
}

/* =========================
   PUBLIC POST
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
            "Too many messages. Please wait a moment and try again.",
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
      email,
      subject,
      message,

      // Honeypot
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
            "Message sent successfully",
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
      typeof email !==
      "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid email",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof message !==
      "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid message",
        },
        {
          status: 400,
        }
      );
    }

    const cleanName =
      name.trim();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const cleanMessage =
      message.trim();

    const cleanSubject =
      typeof subject ===
        "string"
        ? subject.trim()
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

    if (!cleanEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!cleanMessage) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    /* Length limits */

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
      cleanEmail.length > 200
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email is too long",
        },
        {
          status: 400,
        }
      );
    }

    if (
      cleanSubject.length >
      200
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Subject is too long",
        },
        {
          status: 400,
        }
      );
    }

    if (
      cleanMessage.length >
      5000
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message is too long",
        },
        {
          status: 400,
        }
      );
    }

    /* Email format */

    if (
      !isValidEmail(
        cleanEmail
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid email address",
        },
        {
          status: 400,
        }
      );
    }

    /* Save */

    const savedMessage =
      await prisma.message.create(
        {
          data: {
            name: cleanName,
            email:
              cleanEmail,

            subject:
              cleanSubject ||
              null,

            message:
              cleanMessage,
          },
        }
      );

    /* Safe public response */

    return NextResponse.json(
      {
        success: true,
        message:
          "Message sent successfully",
        id: savedMessage.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "MESSAGE POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to save message",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   ADMIN GET
========================= */

export async function GET(
  req: NextRequest
) {
  try {
    const auth =
      checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const messages =
      await prisma.message.findMany(
        {
          orderBy: {
            createdAt:
              "desc",
          },
        }
      );

    return NextResponse.json(
      messages,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "MESSAGE GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load messages",
      },
      {
        status: 500,
      }
    );
  }
}