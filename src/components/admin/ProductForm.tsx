"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";

type ProductFormValues = {
  description: string;
  brand: string;
  model: string;
  code: string;
  itemNumber: string;
  tagsInput: string;
  imageUrl?: string | null;
  isAvailable: boolean;
};

type Props = {
  initialProduct?: Product | null;
  onSubmit: (payload: {
    description: string;
    brand?: string | null;
    model?: string | null;
    code?: string | null;
    itemNumber?: number | null;
    tags: string[];
    imageUrl?: string | null;
    isAvailable: boolean;
  }) => Promise<void>;
  loading?: boolean;
  onCancelEdit?: () => void;
  resetKey?: number;
};

const defaultState: ProductFormValues = {
  description: "",
  brand: "",
  model: "",
  code: "",
  itemNumber: "",
  tagsInput: "",
  imageUrl: "",
  isAvailable: true,
};

const parseTags = (input: string) =>
  input
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

export default function ProductForm({
  initialProduct,
  onSubmit,
  loading = false,
  onCancelEdit,
  resetKey = 0,
}: Props) {
  const [form, setForm] = useState<ProductFormValues>(defaultState);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (initialProduct) {
      setForm({
        description: initialProduct.description ?? "",
        brand: initialProduct.brand ?? "",
        model: initialProduct.model ?? "",
        code: initialProduct.code ?? "",
        itemNumber: initialProduct.itemNumber
          ? String(initialProduct.itemNumber)
          : "",
        tagsInput: initialProduct.tags?.join(", ") ?? "",
        imageUrl: initialProduct.imageUrl ?? "",
        isAvailable: initialProduct.isAvailable ?? true,
      });
    } else {
      setForm(defaultState);
    }
  }, [initialProduct, resetKey]);

  const handleChange = (
    field: keyof ProductFormValues,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (file: File) => {
    try {
      setUploadError("");
      setUploading(true);
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Error subiendo la imagen");
      }

      const result = await response.json();
      handleChange("imageUrl", result.url);
    } catch (error) {
      console.error(error);
      setUploadError("No pudimos subir la imagen, intenta nuevamente.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    await onSubmit({
      description: form.description,
      brand: form.brand || null,
      model: form.model || null,
      code: form.code || null,
      itemNumber: form.itemNumber ? Number(form.itemNumber) : null,
      tags: parseTags(form.tagsInput),
      imageUrl: form.imageUrl || null,
      isAvailable: form.isAvailable,
    });
  };

  return (
    <form onSubmit={onSubmitForm} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-[#10456f]">
            Descripción
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-[--border] bg-white px-4 py-3 text-sm text-[--primary-strong] outline-none focus:ring-2 focus:ring-[--primary]"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#10456f]">
            Marca
          </label>
          <input
            type="text"
            value={form.brand}
            onChange={(event) => handleChange("brand", event.target.value)}
            className="mt-2 w-full rounded-xl border border-[--border] bg-white px-4 py-3 text-sm text-[--primary-strong] outline-none focus:ring-2 focus:ring-[--primary]"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#10456f]">
            Modelo / máquina
          </label>
          <input
            type="text"
            value={form.model}
            onChange={(event) => handleChange("model", event.target.value)}
            className="mt-2 w-full rounded-xl border border-[--border] bg-white px-4 py-3 text-sm text-[--primary-strong] outline-none focus:ring-2 focus:ring-[--primary]"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[--primary]">
            Código / parte
          </label>
          <input
            type="text"
            value={form.code}
            onChange={(event) => handleChange("code", event.target.value)}
            className="mt-2 w-full rounded-xl border border-[--border] bg-white px-4 py-3 text-sm text-[--primary-strong] outline-none focus:ring-2 focus:ring-[--primary]"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[--primary]">
            Ítem (número interno)
          </label>
          <input
            type="number"
            value={form.itemNumber}
            onChange={(event) => handleChange("itemNumber", event.target.value)}
            className="mt-2 w-full rounded-xl border border-[--border] bg-white px-4 py-3 text-sm text-[--primary-strong] outline-none focus:ring-2 focus:ring-[--primary]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-[--primary]">
            Tags (separados por coma)
          </label>
          <input
            type="text"
            value={form.tagsInput}
            onChange={(event) => handleChange("tagsInput", event.target.value)}
            className="mt-2 w-full rounded-xl border border-[--border] bg-white px-4 py-3 text-sm text-[--primary-strong] outline-none focus:ring-2 focus:ring-[--primary]"
            placeholder="Volvo, filtro aceite, XCMG..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_0.5fr] md:items-center">
        <div>
          <label className="text-sm font-semibold text-[#10456f]">
            Imagen (Cloudinary)
          </label>
          <div className="mt-2 flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#10456f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
              {uploading ? "Subiendo..." : "Subir imagen"}
            </label>
            {form.imageUrl && (
              <button
                type="button"
                onClick={() => handleChange("imageUrl", "")}
                className="text-sm font-semibold text-rose-600 underline-offset-4 hover:underline"
              >
                Quitar
              </button>
            )}
          </div>
          {uploadError && <p className="mt-2 text-sm text-rose-600">{uploadError}</p>}
        </div>
        {form.imageUrl && (
          <div className="relative h-28 overflow-hidden rounded-xl border border-[--border] bg-white">
            <Image
              src={form.imageUrl}
              alt="Vista previa"
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-[--accent] p-4">
        <div>
          <p className="text-sm font-semibold text-[--primary]">Disponibilidad</p>
          <p className="text-xs text-[--muted]">
            Controla si el producto se muestra como disponible.
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={form.isAvailable}
            onChange={(event) => handleChange("isAvailable", event.target.checked)}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#10456f] peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-[#10456f]" />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="rounded-full bg-[#10456f] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-[1px] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Guardando..." : initialProduct ? "Actualizar" : "Crear producto"}
        </button>
        {initialProduct && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm font-semibold text-[#10456f] underline-offset-4 hover:underline"
          >
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}
