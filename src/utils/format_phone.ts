// src/utils/phone.ts
export function formatPhoneNumber(raw: string): string {
  // Remove all non-digits
  let digits = raw.replace(/\D/g, "");

  // Remove country code 855 if present
  if (digits.startsWith("855")) {
    digits = digits.substring(3);
  }

  // Ensure it starts with 0
  if (!digits.startsWith("0") && digits.length > 0) {
    digits = "0" + digits;
  }

  // Format with spaces
  if (digits.length === 9) {
    return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  } else if (digits.length === 10) {
    return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }

  return digits;
}
