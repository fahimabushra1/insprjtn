/**
 * Basic lightweight HTML sanitizer to prevent XSS while preserving rich text formatting.
 * Preserves safe tags: h2, h3, p, strong, em, ul, ol, li, a, table, thead, tbody, tr, th, td
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== "string") return "";

  // Remove script tags
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove iframe tags
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  // Remove style tags
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove event handlers (e.g. onclick, onload, onerror, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, "");

  // Remove javascript: links
  clean = clean.replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"');

  return clean;
}
