import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { buildProductSlug, getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  const routes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "catalog", changeFrequency: "daily", priority: 0.9 },
  ] as const;

  const staticEntries = routes.map(({ path, changeFrequency, priority }) => ({
    url: path ? `${baseUrl}/${path}` : baseUrl,
    lastModified,
    changeFrequency,
    priority,
  }));

  const products = await prisma.product.findMany({
    select: { id: true, description: true, updatedAt: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  const productEntries = products.map((product) => ({
    url: `${baseUrl}/catalog/${buildProductSlug(product)}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries];
}
