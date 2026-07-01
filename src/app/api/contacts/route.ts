import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Contact } from "@/lib/db/models/Contact.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const createContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function GET(request: NextRequest) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Contact.find(filter).sort("-createdAt").skip(skip).limit(limit).lean(),
      Contact.countDocuments(filter),
    ]);

    return apiResponse(
      200,
      {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Contact messages retrieved successfully"
    );
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = createContactSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const contact = await Contact.create({
      ...sanitized,
      status: "pending",
    });

    return apiResponse(201, contact, "Message sent successfully");
  } catch (error: any) {
    console.error("Contact message POST error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}
export const dynamic = "force-dynamic";

