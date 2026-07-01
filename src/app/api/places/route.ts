import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Place } from "@/lib/db/models/Place.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { slugify } from "@/lib/backend/slugify";
import { z } from "zod";

const createPlaceSchema = z.object({
  name: z.string().min(2).max(100),
  nameBn: z.string().min(2).max(100),
  latitude: z.number(),
  longitude: z.number(),
  category: z.enum(["gateway", "spot"]),
  description: z.string().min(5),
  history: z.string().optional().default(""),
  featuredImage: z.string().optional().default(""),
  gallery: z.array(z.string()).optional().default([]),
  videos: z.array(z.string()).optional().default([]),
  wildlife: z.object({
    tiger: z.number().min(0).max(5).optional().default(0),
    deer: z.number().min(0).max(5).optional().default(0),
    crocodile: z.number().min(0).max(5).optional().default(0),
    dolphin: z.number().min(0).max(5).optional().default(0),
    birds: z.number().min(0).max(5).optional().default(0),
    reptiles: z.number().min(0).max(5).optional().default(0),
  }).optional().default({ tiger: 0, deer: 0, crocodile: 0, dolphin: 0, birds: 0, reptiles: 0 }),
  bestSeason: z.string().optional().default(""),
  travelTime: z.string().optional().default(""),
  distance: z.string().optional().default(""),
  boatTime: z.string().optional().default(""),
  tourPackages: z.array(z.string()).optional().default([]),
  tips: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");

    const query: any = {};
    if (featured === "true") {
      query.featured = true;
    }

    const places = await Place.find(query).sort("name").lean();
    return apiResponse(200, places, "Places retrieved successfully");
  } catch (error: any) {
    console.error("Places GET error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request, ["admin"]);
    const body = await request.json();
    const parseResult = createPlaceSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);
    const slug = slugify(sanitized.name);

    const existing = await Place.findOne({ slug });
    if (existing) {
      return apiError(409, "A place with this name already exists");
    }

    const place = await Place.create({
      ...sanitized,
      slug,
    });

    return apiResponse(201, place, "Place created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
