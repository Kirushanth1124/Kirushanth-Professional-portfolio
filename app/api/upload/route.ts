import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

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

export async function POST(req: NextRequest) {
  try {
    const auth = checkAdmin(req);

    if (!auth.ok) {
      return auth.response!;
    }

    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "File is required",
        },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum file size is 10MB",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only JPG, PNG, WEBP, GIF and PDF files are allowed",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isPdf =
      file.type === "application/pdf";

    const uploadResult =
      await new Promise<any>(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "kirushanth-portfolio",

                resource_type: isPdf
                  ? "raw"
                  : "image",

                use_filename: true,
                unique_filename: true,
                overwrite: false,
              },
              (error, result) => {
                if (error) {
                  reject(error);
                  return;
                }

                resolve(result);
              }
            );

          uploadStream.end(buffer);
        }
      );

    return NextResponse.json(
      {
        success: true,
        url: uploadResult.secure_url,
        publicId:
          uploadResult.public_id,
        resourceType:
          uploadResult.resource_type,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "File upload failed",
      },
      {
        status: 500,
      }
    );
  }
}