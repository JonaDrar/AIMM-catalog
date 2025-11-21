"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import type { Product } from "@/types/product";

type Props = {
  initialProducts: Product[];
  initialTotal: number;
  pageSize: number;
};

export default function CatalogClient({
  initialProducts,
  initialTotal,
  pageSize,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [totalPages, setTotalPages] = useState(
    Math.max(1, Math.ceil(initialTotal / pageSize))
  );

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 450);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const term = debouncedSearch.trim();

    if (term.length > 0 && term.length < 3) {
      setMessage("Escribe al menos 3 caracteres para buscar.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setMessage("");

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (term.length >= 3) {
          params.set("search", term);
        }

        const response = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await response.json();

        setProducts(data.products ?? []);
        setTotalPages(data.totalPages ?? 1);

        if (!data.products?.length) {
          setMessage("No encontramos resultados para tu búsqueda.");
        }
      } catch {
        setMessage("No se pudo cargar el catálogo, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, page, pageSize]);

  const resultsLabel = useMemo(() => {
    if (loading) return "";
    if (message) return message;
    return "";
  }, [loading, message]);

  return (
    <div className="w-full space-y-6">
      <div className="mx-auto w-full max-w-3xl">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {resultsLabel && (
        <p className="text-center text-sm text-[--muted]">{resultsLabel}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#10456f] border-t-transparent" />
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  );
}
