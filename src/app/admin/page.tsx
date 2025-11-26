import Image from "next/image";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <main className="min-h-screen bg-white pb-12">
      <header className="flex items-center justify-between bg-white px-4 py-4 shadow-sm sm:px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/logos/AIMM.png"
            alt="AIMM logo"
            width={180}
            height={52}
            className="h-12 w-auto object-contain"
            priority
          />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[--muted]">
              Administración
            </p>
            <p className="text-sm font-semibold text-[--primary]">
              Catálogo de repuestos
            </p>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#eef3fb] to-white" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-10">
          <AdminDashboard
            initialProducts={products}
            adminEmail={session?.user?.email}
          />
        </div>
      </section>
    </main>
  );
}
