/**
 * Helper to parse a cookie by name from a cookie string.
 * 
 * @param cookieString The document.cookie string.
 * @param name The name of the cookie to retrieve.
 */
export function getCookieByName(cookieString: string, name: string): string | undefined {
  const match = cookieString.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return undefined;
}

/**
 * Client-side helper to read Meta cookies '_fbp' and '_fbc'.
 */
export function getBrowserCookies() {
  if (typeof document === "undefined") {
    return { fbp: undefined, fbc: undefined };
  }
  const cookies = document.cookie;
  return {
    fbp: getCookieByName(cookies, "_fbp"),
    fbc: getCookieByName(cookies, "_fbc"),
  };
}

/**
 * Normalizes or parses clicking identifier from URL if _fbc cookie isn't set yet.
 * 
 * @param urlStr Current page URL.
 */
export function getFbcFromUrl(urlStr: string): string | undefined {
  try {
    const url = new URL(urlStr);
    const fbclid = url.searchParams.get("fbclid");
    if (fbclid) {
      const creationTime = Date.now();
      return `fb.1.${creationTime}.${fbclid}`;
    }
  } catch {
    // Ignore URL parse errors
  }
  return undefined;
}
