import crypto from "crypto";
import { MetaEventPayload } from "./types";
import { validateMetaEvent } from "./validation";
import { retryWithBackoff } from "./retry";
import { analyticsLogger } from "./logger";

/**
 * Hashes a string using SHA-256 (Server-side).
 * 
 * @param text The input string to hash.
 */
export function sha256(text: string): string {
  return crypto.createHash("sha256").update(text.trim().toLowerCase()).digest("hex");
}

/**
 * Dispatches a validated event payload to Meta Conversion API.
 * Uses exponential backoff retry on failures.
 * 
 * @param payload The event payload to send.
 */
export async function sendToServerCapi(payload: MetaEventPayload): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  
  if (!pixelId || !accessToken) {
    analyticsLogger.warn("Facebook Pixel ID or Access Token is missing. Skipping CAPI event dispatch.");
    return false;
  }
  
  // Validate payload structure
  const validationResult = validateMetaEvent(payload);
  if (!validationResult.success) {
    analyticsLogger.error("CAPI payload validation failed", validationResult.error);
    return false;
  }
  
  const testEventCode = process.env.FACEBOOK_TEST_EVENT_CODE;
  
  const requestBody = {
    data: [payload],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };
  
  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
  
  try {
    await retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData?.error?.message || `Meta CAPI server responded with status code ${response.status}`);
      }
      
      analyticsLogger.info(`Facebook CAPI event '${payload.event_name}' dispatched successfully.`);
    });
    
    return true;
  } catch (error) {
    analyticsLogger.error(`Failed to send event '${payload.event_name}' to Facebook CAPI`, error);
    return false;
  }
}
