import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { LegalPage } from "@/lib/db/models/LegalPage.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import { z } from "zod";

const createLegalPageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  content: z.string().min(1, "Content cannot be empty"),
  isPublished: z.boolean().optional().default(true),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  ogTitle: z.string().optional().default(""),
  ogDescription: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
  canonicalUrl: z.string().optional().default(""),
});

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request, ["admin"]);
    await connectDB();

    const items = await LegalPage.find({})
      .sort({ createdAt: -1 })
      .populate("updatedBy", "name email")
      .lean();

    return apiResponse(200, { items }, "Admin legal pages retrieved successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request, ["admin"]);
    const body = await request.json();

    const parseResult = createLegalPageSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const data = parseResult.data;
    const sanitized = {
      title: data.title.trim().replace(/[<>]/g, ""),
      slug: data.slug.trim().toLowerCase(),
      content: sanitizeHtml(data.content),
      isPublished: data.isPublished,
      seoTitle: (data.seoTitle || "").trim().replace(/[<>]/g, ""),
      seoDescription: (data.seoDescription || "").trim().replace(/[<>]/g, ""),
      ogTitle: (data.ogTitle || "").trim().replace(/[<>]/g, ""),
      ogDescription: (data.ogDescription || "").trim().replace(/[<>]/g, ""),
      ogImage: (data.ogImage || "").trim(),
      canonicalUrl: (data.canonicalUrl || "").trim(),
    };

    // Check slug uniqueness
    const existing = await LegalPage.findOne({ slug: sanitized.slug });
    if (existing) {
      return apiError(400, "A page with this slug already exists");
    }

    const page = await LegalPage.create({
      ...sanitized,
      updatedBy: user._id,
    });

    return apiResponse(201, page, "Legal page created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
