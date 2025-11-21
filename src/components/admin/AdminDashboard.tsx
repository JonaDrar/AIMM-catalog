"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import type { Product } from "@/types/product";
import ProductForm from "./ProductForm";

type Props = {
  initialProducts: Product[];
  adminEmail?: string | null;
};

export default function AdminDashboard({ initialProducts, adminEmail }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("");
  const [resetKey, setResetKey] = useState(0);

  const filteredProducts = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) =>
      [product.description, product.brand, product.code]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [filter, products]);

  const handleSave = async (payload: {
    description: string;
    brand?: string | null;
    model?: string | null;
    code?: string | null;
    itemNumber?: number | null;
    tags: string[];
    imageUrl?: string | null;
    isAvailable: boolean;
  }) => {
    setLoading(true);
    setStatus("");

    try {
      const endpoint = selected
        ? `/api/products/${selected.id}`
        : "/api/products";
      const method = selected ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el producto");
      }

      const saved: Product = await response.json();

      setProducts((prev) =>
        selected
          ? prev.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...prev]
      );

      setSelected(null);
      if (!selected) {
        setResetKey((value) => value + 1);
      }
      setStatus("Producto guardado correctamente.");
    } catch (error) {
      console.error(error);
      setStatus("Ocurrió un error guardando el producto.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    const confirmed = window.confirm("¿Eliminar este producto?");
    if (!confirmed) return;

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar");
      }

      setProducts((prev) => prev.filter((item) => item.id !== productId));
      if (selected?.id === productId) {
        setSelected(null);
      }
      setStatus("Producto eliminado.");
    } catch (error) {
      console.error(error);
      setStatus("Error eliminando el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/95 p-4 shadow-sm ring-2 ring-[--primary]/15">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[--muted]">
            Panel de administración
          </p>
          <p className="text-sm font-semibold text-[--primary]">
            {adminEmail ?? "Usuario"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full bg-[#10456f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-[#10456f] hover:shadow-md"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <div className="rounded-2xl bg-white/95 p-6 shadow-lg ring-2 ring-[--primary]/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#10456f]">
                  {selected ? "Editar" : "Nuevo"} producto
                </p>
                <h2 className="text-lg font-semibold text-[#10456f]">
                  Detalles
                </h2>
              </div>
              <span className="rounded-full bg-[--accent] px-3 py-1 text-xs font-semibold text-[#10456f]">
                {selected ? "Edición" : "Crear"}
              </span>
            </div>

            <div className="mt-4">
              <ProductForm
                initialProduct={selected}
                onSubmit={handleSave}
                loading={loading}
                resetKey={resetKey}
                onCancelEdit={() => setSelected(null)}
              />
              {status && (
                <p className="mt-3 text-sm text-[--muted]">{status}</p>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-white/95 p-6 shadow-lg ring-2 ring-[--primary]/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[--muted]">
                  Catálogo
                </p>
                <h2 className="text-lg font-semibold text-[--primary]">
                  {products.length} productos
                </h2>
              </div>
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Filtrar por descripción o marca"
                className="w-full max-w-xs rounded-full border border-[--border] px-4 py-2 text-sm text-[--primary-strong] outline-none focus:ring-2 focus:ring-[--primary]"
              />
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-[--border]">
              <div className="overflow-x-auto">
                <table className="divide-y divide-[--border]">
                  <thead className="bg-[--accent]">
                    <tr className="text-left text-xs font-semibold uppercase text-[#10456f]">
                      <th className="px-4 py-3">Descripción</th>
                      <th className="px-4 py-3">Marca</th>
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--border] bg-white text-sm text-[--primary-strong]">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className={selected?.id === product.id ? "bg-[--accent]" : ""}
                      >
                        <td className="px-4 py-3">{product.description}</td>
                        <td className="px-4 py-3">{product.brand ?? "—"}</td>
                        <td className="px-4 py-3">{product.code ?? "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelected(product)}
                              className="rounded-full bg-[#10456f] px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-[#10456f] hover:shadow-md"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-rose-200"
                              disabled={loading}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!filteredProducts.length && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-sm text-[--muted]"
                        >
                          No hay productos que coincidan con el filtro.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
