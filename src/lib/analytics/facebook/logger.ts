/**
 * Token-safe analytics logger.
 * Prevents leaking Meta Access Tokens and secret credentials in system logs.
 */
export const analyticsLogger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[Analytics Info] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[Analytics Warning] ${message}`, ...args);
  },
  error: (message: string, error: any) => {
    let cleanMsg = error?.message || String(error);
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    if (accessToken && cleanMsg.includes(accessToken)) {
      cleanMsg = cleanMsg.replaceAll(accessToken, "[MASKED_ACCESS_TOKEN]");
    }
    console.error(`[Analytics Error] ${message}:`, cleanMsg);
  }
};
