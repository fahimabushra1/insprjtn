import { NextResponse } from "next/server";

/**
 * Standard API Response constructor helper.
 */
export function apiResponse(statusCode: number, data: any, message = "Success") {
  return NextResponse.json(
    {
      statusCode,
      success: statusCode < 400,
      message,
      data,
    },
    { status: statusCode }
  );
}

/**
 * Standard API Error constructor helper.
 */
export function apiError(statusCode: number, message: string) {
  return NextResponse.json(
    {
      statusCode,
      success: false,
      message,
    },
    { status: statusCode }
  );
}
