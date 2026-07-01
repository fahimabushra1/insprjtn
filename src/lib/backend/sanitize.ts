/**
 * Sanitizes input text string by stripping html tags and special characters.
 */
export const sanitize = (text: any): any => {
  if (typeof text !== "string") return text;
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'&]/g, "")
    .trim();
};

/**
 * Sanitizes keys inside an object recursively.
 */
export const sanitizeObject = (obj: any): any => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = sanitize(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? sanitize(item) : item
      );
    } else if (value !== null && typeof value === "object") {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};
