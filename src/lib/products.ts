import prisma from "./prisma";
import type { Prisma } from "@prisma/client";

export const DEFAULT_PAGE_SIZE = 10;

export type ProductPayload = {
  itemNumber?: number | null;
  description: string;
  brand?: string | null;
  model?: string | null;
  code?: string | null;
  tags?: string[];
  imageUrl?: string | null;
  isAvailable?: boolean;
};

const normalizeTags = (tags?: string[]) =>
  Array.from(
    new Set(
      (tags ?? [])
        .map((tag) => tag?.trim())
        .filter((tag): tag is string => Boolean(tag && tag.length > 0))
    )
  );

const buildWhere = (search?: string): Prisma.ProductWhereInput => {
  const term = search?.trim();
  if (!term) return {};

  return {
    OR: [
      { description: { contains: term, mode: "insensitive" } },
      { brand: { contains: term, mode: "insensitive" } },
      { model: { contains: term, mode: "insensitive" } },
      { code: { contains: term, mode: "insensitive" } },
      { tags: { has: term } },
    ],
  };
};

export async function getProducts({
  search,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const currentPage =
    typeof page === "number" && !Number.isNaN(page) ? Math.max(1, page) : 1;
  const safePageSize =
    typeof pageSize === "number" && !Number.isNaN(pageSize)
      ? pageSize
      : DEFAULT_PAGE_SIZE;
  const take = Math.min(Math.max(safePageSize, 1), 50);
  const skip = (currentPage - 1) * take;

  const where = buildWhere(search);

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: [{ itemNumber: "asc" }, { createdAt: "desc" }],
      skip,
      take,
    }),
  ]);

  return {
    products,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
  };
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({ where: { id } });
}

export async function createProduct(payload: ProductPayload) {
  const tags = normalizeTags(payload.tags);

  return prisma.product.create({
    data: {
      description: payload.description,
      brand: payload.brand ?? null,
      model: payload.model ?? null,
      code: payload.code ?? null,
      itemNumber:
        payload.itemNumber === undefined ? null : Number(payload.itemNumber),
      tags,
      imageUrl: payload.imageUrl ?? null,
      isAvailable: payload.isAvailable ?? true,
    },
  });
}

export async function updateProduct(id: number, payload: ProductPayload) {
  const tags = normalizeTags(payload.tags);

  return prisma.product.update({
    where: { id },
    data: {
      description: payload.description,
      brand: payload.brand ?? null,
      model: payload.model ?? null,
      code: payload.code ?? null,
      itemNumber:
        payload.itemNumber === undefined ? null : Number(payload.itemNumber),
      tags,
      imageUrl: payload.imageUrl ?? null,
      isAvailable: payload.isAvailable ?? true,
    },
  });
}

export async function removeProduct(id: number) {
  return prisma.product.delete({ where: { id } });
}
