import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import CatalogClient from "@/components/catalog/CatalogClient";
import { DEFAULT_PAGE_SIZE, getProducts } from "@/lib/products";
import { SITE_NAME, getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de repuestos para maquinaria pesada",
  description:
    "Busca repuestos por código, marca o modelo y valida disponibilidad en línea. Consulta equivalencias para cargadores frontales, excavadoras y camiones.",
  alternates: { canonical: "/catalog" },
  openGraph: {
    title: `${SITE_NAME} | Catálogo de repuestos`,
    description:
      "Encuentra filtros, pastillas de freno, kits y repuestos compatibles con tu maquinaria pesada. Respuesta rápida y asesoría técnica.",
    url: `${getSiteUrl()}/catalog`,
    images: [
      {
        url: "/assets/images/camion.jpg",
        width: 1200,
        height: 630,
        alt: "Camión de obra con repuestos disponibles en catálogo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function CatalogPage() {
  const { products, total } = await getProducts({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  return (
    <main className="min-h-screen bg-white pb-16">
      <header className="flex items-center justify-between px-4 py-4 sm:px-10">
        <Image
          src="/assets/logos/AIMM.png"
          alt="AIMM logo"
          width={180}
          height={52}
          className="h-12 w-auto object-contain"
          priority
        />
       <h1 className="text-center text-3xl font-extrabold uppercase text-[--primary] hidden md:block">
          Catálogo
        </h1>
        <Link
          href="/"
          className="text-sm font-light text-[#10456f] underline-offset-4 hover:underline"
        >
          Volver al inicio
        </Link>
      </header>

      <div className="flex w-full flex-col">
        <div className="relative overflow-hidden shadow-lg">
          <Image
            src="/assets/images/camion.jpg"
            alt="Camión de obra"
            height={480}
            width={1200}
            className="w-full object-cover h-[250px]"
            priority
          />
        </div>

        <div className="mx-auto w-full p-10 transform translate-y-[-60px]">
          <CatalogClient
            initialProducts={products}
            initialTotal={total}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        </div>
      </div>

      <Link
        href="https://wa.me/56976204924"
        className="fixed bottom-5 right-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:-translate-y-[2px] hover:shadow-xl"
        aria-label="WhatsApp"
      >
        <Image
          src="/assets/icons/WhatsApp.png"
          alt="WhatsApp"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </Link>
    </main>
  );
}
