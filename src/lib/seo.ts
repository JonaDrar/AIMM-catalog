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
