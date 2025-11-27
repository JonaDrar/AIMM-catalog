import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  const routes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "catalog", changeFrequency: "daily", priority: 0.9 },
  ] as const;

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: path ? `${baseUrl}/${path}` : baseUrl,
    lastModified,
    changeFrequency,
    priority,
  }));
}
