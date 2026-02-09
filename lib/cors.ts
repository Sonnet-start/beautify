import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = ["http://localhost:3000", process.env.NEXT_PUBLIC_SITE_URL || ""].filter(
  Boolean
);

export function setCORSHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get("origin");

  // Check if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");
  response.headers.set("Vary", "Origin");

  return response;
}

export function handleCORSOptions(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return setCORSHeaders(request, response);
}
