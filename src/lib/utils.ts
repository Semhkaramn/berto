import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL'yi normalize et - https:// yoksa ekle
export function normalizeUrl(url: string): string {
  if (!url || url.trim() === "") return "";

  const trimmedUrl = url.trim();

  // Zaten http:// veya https:// ile başlıyorsa dokunma
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }

  // www. ile başlıyorsa https:// ekle
  if (trimmedUrl.startsWith("www.")) {
    return `https://${trimmedUrl}`;
  }

  // Diğer durumlarda da https:// ekle (örn: google.com)
  if (trimmedUrl.includes(".") && !trimmedUrl.startsWith("/")) {
    return `https://${trimmedUrl}`;
  }

  return trimmedUrl;
}
