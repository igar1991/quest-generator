import { NextResponse } from "next/server";

/**
 * Health check endpoint
 * GET /api/health
 * @returns API status information
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
