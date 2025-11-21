import Image from "next/image";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { authOptions } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[--background] px-4 py-10">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-[--background]" />
      </div>
      <div className="relative z-10 w-full max-w-5xl grid gap-6 sm:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-4 text-[--primary]">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logos/AIMM.png"
              alt="AIMM"
              width={180}
              height={52}
              className="h-12 w-auto object-contain"
              priority
            />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[--muted]">
                Panel interno
              </p>
              <p className="text-lg font-semibold">Accede para administrar</p>
            </div>
          </div>
          <p className="text-sm text-[--muted]">
            Mantén el catálogo al día, sube imágenes a Cloudinary y controla la disponibilidad.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
