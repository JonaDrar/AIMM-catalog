"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour <= 11) return "Buen día";
    if (hour >= 12 && hour <= 19) return "Buenas tardes";
    return "Buenas noches";
  })();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });

    setLoading(false);

    if (response?.error) {
      setError("Credenciales incorrectas. Intenta nuevamente.");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-white/95 p-8 shadow-xl ring-2 ring-[--primary]/15 backdrop-blur">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-[--muted]">
          Administrador
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-[--primary]">
          {greeting}, Miguel
        </h1>
        <p className="mt-1 text-sm text-[--muted]">
          Inicia sesión para gestionar el catálogo de repuestos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-[--primary]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-[--border] bg-white px-4 py-3 text-sm text-[--primary-strong] outline-none focus:ring-2 focus:ring-[--primary]"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[--primary]">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-[--border] bg-white px-4 py-3 text-sm text-[--primary-strong] outline-none focus:ring-2 focus:ring-[--primary]"
          />
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#10456f] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-[--primary-strong] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
