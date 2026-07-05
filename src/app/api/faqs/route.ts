import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Faq } from "@/lib/db/models/Faq.model";
import { verifyAuth, optionalAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import { z } from "zod";

const createFaqSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
  answer: z.string().min(5, "Answer must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
  order: z.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(true),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { user } = await optionalAuth(request);

    // If admin is requesting, return full list with pagination & filters
    if (user && user.role === "admin") {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const search = searchParams.get("search") || "";
      const category = searchParams.get("category") || "";

      const query: any = {};

      if (search) {
        query.$or = [
          { question: { $regex: search, $options: "i" } },
          { answer: { $regex: search, $options: "i" } },
        ];
      }

      if (category && category !== "all") {
        query.category = category;
      }

      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        Faq.find(query)
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("createdBy", "name email")
          .lean(),
        Faq.countDocuments(query),
      ]);

      return apiResponse(200, {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }, "Admin FAQs retrieved successfully");
    }

    // Public request: return all published FAQs sorted by order
    const items = await Faq.find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return apiResponse(200, { items }, "Published FAQs retrieved successfully");
  } catch (error: any) {
    return apiError(500, error.message || "Failed to retrieve FAQs");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request, ["admin"]);
    const body = await request.json();

    const parseResult = createFaqSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const { question, answer, category, order, isPublished } = parseResult.data;
    const sanitized = {
      question: question.trim().replace(/[<>]/g, ""),
      answer: sanitizeHtml(answer),
      category: category.trim().replace(/[<>]/g, ""),
      order,
      isPublished,
    };

    const faq = await Faq.create({
      ...sanitized,
      createdBy: user._id,
    });

    return apiResponse(201, faq, "FAQ created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
