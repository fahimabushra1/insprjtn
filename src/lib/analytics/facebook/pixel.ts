import { analyticsLogger } from "./logger";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

let isInitialized = false;

/**
 * Initializes the Meta Pixel on the browser.
 * Ensures the initialization runs only once and in the browser context.
 */
export function initPixel(): void {
  if (typeof window === "undefined") return;
  if (isInitialized) return;

  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  if (!pixelId) {
    analyticsLogger.warn("Meta Pixel ID is missing. Browser pixel initialization skipped.");
    return;
  }

  // Check if fbq already exists
  if (window.fbq) {
    isInitialized = true;
    return;
  }

  /* eslint-disable */
  // Standard Meta Pixel initialization script
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", pixelId);
  isInitialized = true;
  analyticsLogger.info("Meta Pixel initialized successfully.");
}

/**
 * Safe wrapper around the window.fbq function.
 * 
 * @param action Event operation: 'track' or 'trackCustom'.
 * @param eventName Name of the event to track.
 * @param payload Event metadata parameters.
 * @param options Event options (e.g. eventID).
 */
export function fbq(action: string, eventName: string, payload?: any, options?: any): void {
  if (typeof window !== "undefined" && window.fbq) {
    if (options) {
      window.fbq(action, eventName, payload, options);
    } else if (payload) {
      window.fbq(action, eventName, payload);
    } else {
      window.fbq(action, eventName);
    }
  }
}
