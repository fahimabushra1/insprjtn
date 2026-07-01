import { analyticsLogger } from "./logger";

/**
 * Retries an asynchronous function with exponential backoff.
 * 
 * @param fn The async function to execute.
 * @param retries Number of retries remaining.
 * @param delay Initial delay in milliseconds.
 * @param backoffFactor Multiplier for exponential backoff.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoffFactor = 2
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    analyticsLogger.warn(`Meta request failed. Retrying in ${delay}ms... (${retries} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * backoffFactor, backoffFactor);
  }
}
