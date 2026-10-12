/**
 * Accepts HTTPS links to Instagram posts or profiles.
 * Rejects other hosts, protocols, and empty paths.
 */
export function getSafeInstagramUrl(
  value: string | null | undefined,
): string | null {
  if (!value?.trim()) {
    return null;
  }

  try {
    const url = new URL(value.trim());

    const isInstagramHost =
      url.hostname === "instagram.com" ||
      url.hostname === "www.instagram.com";

    if (
      url.protocol !== "https:" ||
      !isInstagramHost ||
      url.pathname.length <= 1 ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}