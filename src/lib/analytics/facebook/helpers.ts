/**
 * Normalizes a Bangladeshi phone number to 880XXXXXXXXXX format.
 * - Removes non-digits.
 * - Handles 01XXXXXXXXX by prepending 88.
 * - Handles 880XXXXXXXXXX.
 * - Handles 1XXXXXXXXX (10 digits starting with 1) by prepending 880.
 * 
 * @param phone Raw phone string.
 */
export function normalizeBdPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.startsWith("880") && cleaned.length === 13) {
    return cleaned;
  }
  
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return "88" + cleaned;
  }
  
  if (cleaned.length === 10 && cleaned.startsWith("1")) {
    return "880" + cleaned;
  }
  
  return cleaned;
}

/**
 * Splits a full name into first and last name.
 * 
 * @param fullName Full name string.
 */
export function splitName(fullName?: string): { firstName?: string; lastName?: string } {
  if (!fullName) return {};
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0] };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}
