const QATAR_COUNTRY_CODE = '974';

/**
 * Normalizes a stored phone string for wa.me (digits only, Qatar-aware).
 */
export function formatPhoneForWhatsApp(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  if (digits.startsWith(QATAR_COUNTRY_CODE)) {
    return digits;
  }

  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length >= 8 && digits.length <= 10) {
    return `${QATAR_COUNTRY_CODE}${digits}`;
  }

  if (digits.length >= 11) {
    return digits;
  }

  return null;
}

export function buildWhatsAppSellerUrl(phone: string, message: string): string | null {
  const normalized = formatPhoneForWhatsApp(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function buildListingWhatsAppMessage(title: string, listingUrl: string): string {
  return `Hi, I'm interested in your Suqora listing: "${title}". ${listingUrl}`;
}