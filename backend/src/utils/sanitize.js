export const sanitize = (text) => {
  if (typeof text !== "string") return text;
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'&]/g, "")
    .trim();
};

export const sanitizeObject = (obj) => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = sanitize(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? sanitize(item) : item
      );
    } else {
      result[key] = value;
    }
  }
  return result;
};
