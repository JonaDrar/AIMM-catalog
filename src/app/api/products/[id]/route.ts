import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { getProductById, removeProduct, updateProduct } from "@/lib/products";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

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

const ensureAuth = async () => {
  const session = (await getServerSession(authOptions)) as Session | null;
  return session?.user?.email;
};

type ParamsPromise = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  { params }: ParamsPromise
) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: ParamsPromise
) {
  if (!(await ensureAuth())) {
    return NextResponse.json({ error: "Acceso no autorizado" }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    if (!body?.description) {
      return NextResponse.json(
        { error: "Descripción requerida" },
        { status: 400 }
      );
    }

    const updated = await updateProduct(id, {
      description: body.description,
      brand: body.brand ?? null,
      model: body.model ?? null,
      code: body.code ?? null,
      itemNumber: body.itemNumber ? Number(body.itemNumber) : null,
      tags: parseTags(body.tags),
      imageUrl: body.imageUrl ?? null,
      isAvailable: body.isAvailable ?? true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: ParamsPromise
) {
  if (!(await ensureAuth())) {
    return NextResponse.json({ error: "Acceso no autorizado" }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    await removeProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el producto" },
      { status: 500 }
    );
  }
}
