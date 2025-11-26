import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import {
  SITE_NAME,
  SITE_TAGLINE,
  getMetadataBase,
} from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const baseDescription =
  "AIMM abastece repuestos certificados para maquinaria pesada; encuentra filtros, pastillas de freno y kits completos para tus cargadores frontales, excavadoras y camiones con despacho rápido y asesoría técnica.";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: `${SITE_NAME} | Repuestos para maquinaria pesada`,
    template: `%s | ${SITE_NAME}`,
  },
  description: baseDescription,
  applicationName: SITE_NAME,
  keywords: [
    "repuestos maquinaria pesada",
    "filtros cargadores frontales",
    "pastillas de freno maquinaria",
    "repuestos excavadora",
    "repuestos XCMG",
    "repuestos Komatsu",
    "repuestos Volvo",
    "repuestos Cummins",
    "repuestos Sany",
  ],
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: baseDescription,
    url: "/",
    siteName: SITE_NAME,
    locale: "es",
    type: "website",
    images: [
      {
        url: "/assets/images/retros.png",
        width: 1200,
        height: 630,
        alt: "Maquinaria pesada con repuestos disponibles en AIMM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: baseDescription,
    images: ["/assets/images/retros.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  creator: SITE_NAME,
  publisher: SITE_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
