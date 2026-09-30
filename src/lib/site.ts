/**
 * Canonical origin for metadata, robots.txt and the sitemap.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — set this once you attach a custom domain
 *   2. VERCEL_URL — injected automatically on every Vercel deployment
 *   3. localhost, for `next dev` / `next start`
 *
 * Hardcoding a URL here means every preview deployment advertises the wrong
 * canonical, so it is read from the environment instead.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
