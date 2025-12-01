import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import {
  SITE_NAME,
  SITE_TAGLINE,
  buildAbsoluteUrl,
  getProductUrl,
  getSiteUrl,
} from "@/lib/seo";

type PageParams = {
  params: Promise<{ slug: string }>;
};

const parseIdFromSlug = (slug?: string | null) => {
  if (!slug) return null;
  const [idPart] = slug.split("-");
  const id = Number(idPart);
  return Number.isNaN(id) ? null : id;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const productId = parseIdFromSlug(slug);
  if (!productId) {
    return { title: "Producto no encontrado", robots: { index: false, follow: false } };
  }

  const product = await getProductById(productId);
  if (!product) {
    return { title: "Producto no disponible", robots: { index: false, follow: false } };
  }

  const productUrl = getProductUrl(product);
  const imageUrl = buildAbsoluteUrl(product.imageUrl ?? "/assets/images/retros.png");
  const summaryParts = [
    product.description,
    product.brand,
    product.model,
    "Repuestos certificados y despacho rápido",
  ].filter(Boolean);
  const summary = `${summaryParts.join(" · ")}. ${SITE_TAGLINE}`;
  const keywords = [
    product.description,
    product.brand,
    product.model,
    product.code,
    "repuestos maquinaria pesada",
    "catálogo de repuestos",
  ].filter(Boolean) as string[];

  return {
    title: `${product.description} | ${SITE_NAME}`,
    description: summary,
    alternates: { canonical: productUrl },
    openGraph: {
      title: product.description,
      description: summary,
      url: productUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.description,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.description,
      description: summary,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
    keywords,
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const productId = parseIdFromSlug(slug);
  if (!productId) notFound();

  const product = await getProductById(productId);
  if (!product) notFound();

  const productUrl = getProductUrl(product);
  const imageUrl = buildAbsoluteUrl(product.imageUrl ?? "/assets/images/retros.png");
  const availability = product.isAvailable ? "Disponible para despacho" : "Disponible a pedido";
  const tags = product.tags ?? [];

  const productSchema = {
    "@type": "Product",
    name: product.description,
    description: `${product.description} - ${SITE_TAGLINE}`,
    image: [imageUrl],
    sku: product.code ?? undefined,
    mpn: product.code ?? undefined,
    model: product.model ?? undefined,
    productID: product.id,
    url: productUrl,
    category: "Repuestos maquinaria pesada",
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    additionalProperty: [
      product.brand
        ? { "@type": "PropertyValue", name: "Marca", value: product.brand }
        : null,
      product.model
        ? { "@type": "PropertyValue", name: "Modelo", value: product.model }
        : null,
      product.code
        ? { "@type": "PropertyValue", name: "Código", value: product.code }
        : null,
      product.itemNumber
        ? { "@type": "PropertyValue", name: "ItemNumber", value: product.itemNumber }
        : null,
      { "@type": "PropertyValue", name: "Disponibilidad", value: availability },
      ...tags.map((tag) => ({
        "@type": "PropertyValue",
        name: "Etiqueta",
        value: tag,
      })),
    ].filter(Boolean),
    mainEntityOfPage: productUrl,
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: getSiteUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catálogo",
        item: `${getSiteUrl()}/catalog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.description,
        item: productUrl,
      },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [productSchema, breadcrumbSchema],
  };

  const whatsappUrl = new URL("https://wa.me/56976204924");
  whatsappUrl.searchParams.set(
    "text",
    `Hola, necesito cotizar el repuesto "${product.description}"${product.code ? ` (código ${product.code})` : ""}.`
  );

  return (
    <main className="min-h-screen bg-white pb-12">
      <header className="flex items-center justify-between px-4 py-4 sm:px-10">
        <Link href="/catalog" className="text-sm font-semibold text-[#10456f] hover:underline">
          ← Volver al catálogo
        </Link>
        <Image
          src="/assets/logos/AIMM.png"
          alt="AIMM logo"
          width={180}
          height={52}
          className="h-12 w-auto object-contain"
          priority
        />
        <Link
          href="/"
          className="text-sm font-light text-[#10456f] underline-offset-4 hover:underline"
        >
          Inicio
        </Link>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-[--muted]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[--primary] hover:underline">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/catalog" className="hover:text-[--primary] hover:underline">
                Catálogo
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[--primary] font-semibold line-clamp-1">{product.description}</li>
          </ol>
        </nav>

        <section className="grid gap-8 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm sm:p-6 md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f8fafc]">
            <Image
              src={imageUrl}
              alt={product.description}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[--muted]">
                Repuesto
              </p>
              <h1 className="text-2xl font-extrabold uppercase leading-tight text-[--primary]">
                {product.description}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[--muted]">
                {product.brand && (
                  <span className="rounded-full bg-[#eef2f7] px-3 py-1 font-semibold text-[--primary]">
                    Marca: {product.brand}
                  </span>
                )}
                {product.model && (
                  <span className="rounded-full bg-[#eef2f7] px-3 py-1 font-semibold text-[--primary]">
                    Modelo: {product.model}
                  </span>
                )}
                {product.code && (
                  <span className="rounded-full bg-[#eef2f7] px-3 py-1 font-semibold text-[--primary]">
                    Código: {product.code}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                  product.isAvailable
                    ? "bg-[#dcfce7] text-[#166534]"
                    : "bg-[#fff7ed] text-[#c2410c]"
                }`}
              >
                {availability}
              </span>

            </div>

            {tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[--primary]">Etiquetas</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#e5e7eb] px-3 py-1 text-xs font-semibold uppercase text-[--muted]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-[--muted]">
              Solicita la compatibilidad exacta con tu equipo o pide alternativas equivalentes.
              Respuesta rápida y asesoría técnica directa por WhatsApp.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={whatsappUrl.toString()}
                className="inline-flex items-center justify-center rounded-md bg-[#25D366] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:-translate-y-[1px] hover:shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cotizar por WhatsApp
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-md border border-[#10456f] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#10456f] transition hover:-translate-y-[1px] hover:bg-[#eff6ff]"
              >
                Ver más repuestos
              </Link>
            </div>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
