const FALLBACK_URL = "http://localhost:3000";

const normalizeUrl = (value?: string | null) => {
  if (!value) return FALLBACK_URL;
  const trimmed = value.trim();
  if (trimmed.length === 0) return FALLBACK_URL;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return FALLBACK_URL;
  }
};

export const getSiteUrl = () => normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const getMetadataBase = () => new URL(getSiteUrl());

export const SITE_NAME = "AIMM Repuestos";
export const SITE_TAGLINE =
  "Repuestos certificados para maquinaria pesada";

export const buildAbsoluteUrl = (path: string) => {
  const value = path?.trim();
  if (!value) return getSiteUrl();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${getSiteUrl()}${normalizedPath}`;
};

export const slugify = (value: string) => {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base.length === 0 ? "producto" : base;
};

export const buildProductSlug = (product: { id: number; description?: string | null }) => {
  const safeDescription = product.description ?? "producto";
  return `${product.id}-${slugify(safeDescription)}`;
};

export const getProductUrl = (product: { id: number; description?: string | null }) =>
  `${getSiteUrl()}/catalog/${buildProductSlug(product)}`;
