import { NextRequest, NextResponse } from "next/server";
import { cookies as getCookies } from "next/headers";
import { sendToServerCapi, sha256 } from "@/lib/analytics/facebook/capi";
import { MetaEventPayload, MetaUserData } from "@/lib/analytics/facebook/types";
import { normalizeBdPhoneNumber, splitName } from "@/lib/analytics/facebook/helpers";
import { analyticsLogger } from "@/lib/analytics/facebook/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, eventId, eventTime, eventSourceUrl, userData = {}, customData = {} } = body;

    if (!eventName || !eventId) {
      return NextResponse.json({ error: "Missing eventName or eventId" }, { status: 400 });
    }

    // Retrieve IP and User-Agent from headers
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
                      request.headers.get("x-real-ip") || 
                      "127.0.0.1";

    // Read cookies from next/headers
    const cookieStore = await getCookies();
    const fbpCookie = cookieStore.get("_fbp")?.value;
    const fbcCookie = cookieStore.get("_fbc")?.value;

    const fbcVal = userData.fbc || fbcCookie || "";
    const fbpVal = userData.fbp || fbpCookie || "";

    // Normalize and hash user matching data
    const user_data: MetaUserData = {
      client_ip_address: ipAddress,
      client_user_agent: userAgent,
    };

    if (fbpVal) user_data.fbp = fbpVal;
    if (fbcVal) user_data.fbc = fbcVal;

    if (userData.email) {
      user_data.em = [sha256(userData.email)];
    }

    if (userData.phone) {
      const normalizedPhone = normalizeBdPhoneNumber(userData.phone);
      if (normalizedPhone) {
        user_data.ph = [sha256(normalizedPhone)];
      }
    }

    if (userData.name) {
      const { firstName, lastName } = splitName(userData.name);
      if (firstName) user_data.fn = [sha256(firstName)];
      if (lastName) user_data.ln = [sha256(lastName)];
    }

    const payload: MetaEventPayload = {
      event_name: eventName,
      event_time: eventTime || Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: eventSourceUrl || request.url,
      action_source: "website",
      user_data,
      custom_data: customData,
    };

    // Send to Facebook CAPI
    const success = await sendToServerCapi(payload);

    return NextResponse.json({ success });
  } catch (error) {
    analyticsLogger.error("Error in Meta CAPI route handler POST method", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
