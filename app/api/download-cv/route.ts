import { NextResponse } from "next/server";

export async function GET() {
  const cvUrl = process.env.CV_URL;

  if (!cvUrl) {
    return NextResponse.json(
      { error: "CV URL not configured" },
      { status: 404 }
    );
  }

  const response = await fetch(cvUrl);

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to download CV" },
      { status: 500 }
    );
  }

  const file = await response.arrayBuffer();

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="Kirushanth-CV.pdf"',
    },
  });
}