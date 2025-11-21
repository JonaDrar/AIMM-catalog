import { getServerSession } from "next-auth/next";
import { createProduct, getProducts, DEFAULT_PAGE_SIZE } from "@/lib/products";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";

const parseTags = (raw: unknown) => {
  if (Array.isArray(raw)) {
    return raw
      .map((value) => (typeof value === "string" ? value : ""))
      .filter((value) => value.length > 0);
  }

  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  return [];
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);

  const result = await getProducts({ search, page, pageSize });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Acceso no autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body?.description) {
      return NextResponse.json(
        { error: "Descripción requerida" },
        { status: 400 }
      );
    }

    const product = await createProduct({
      description: body.description,
      brand: body.brand ?? null,
      model: body.model ?? null,
      code: body.code ?? null,
      itemNumber: body.itemNumber ? Number(body.itemNumber) : null,
      tags: parseTags(body.tags),
      imageUrl: body.imageUrl ?? null,
      isAvailable: body.isAvailable ?? true,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product", error);
    return NextResponse.json(
      { error: "No se pudo crear el producto" },
      { status: 500 }
    );
  }
}
