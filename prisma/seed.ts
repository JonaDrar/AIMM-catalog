import "dotenv/config";
import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

type CsvRecord = Record<string, string>;

const csvPath = path.join(process.cwd(), "prisma", "data", "listado-repuestos.csv");

async function loadCsv(): Promise<CsvRecord[]> {
  const content = await fs.readFile(csvPath, "utf8");

  return parse(content, {
    columns: (header) =>
      header.map((col: string, idx: number) => {
        const trimmed = col?.trim();
        if (!trimmed) return `COL_${idx}`;
        return trimmed.toUpperCase() === "TAG" ? `TAG${idx}` : trimmed;
      }),
    skip_empty_lines: true,
    trim: true,
  });
}

async function seedProducts() {
  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log(`Products already present (${existingCount}), skipping CSV seed.`);
    return;
  }

  const rows = await loadCsv();
  const data = rows.map((row) => {
    const rawTags = Object.keys(row)
      .filter((key) => key.toUpperCase().startsWith("TAG"))
      .map((key) => row[key])
      .filter(Boolean)
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    const uniqueTags = Array.from(new Set(rawTags));

    return {
      itemNumber: row.ITEM ? Number(row.ITEM) : undefined,
      description: row.DESCRIPCION || "Producto sin nombre",
      brand: uniqueTags[0] ?? null,
      model: uniqueTags[1] ?? null,
      code: uniqueTags[uniqueTags.length - 1] ?? null,
      tags: uniqueTags,
      isAvailable: true,
    };
  });

  await prisma.product.createMany({ data });
  console.log(`Seeded ${data.length} products`);
}

async function seedAdminUser() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD missing; skipping admin seed.");
    return;
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin user already exists, skipping.");
    return;
  }

  const passwordHash = await hash(password, 10);
  await prisma.adminUser.create({
    data: { email, passwordHash },
  });

  console.log(`Admin user created for ${email}`);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to run the seed.");
  }

  await seedProducts();
  await seedAdminUser();
}

main()
  .catch((error) => {
    console.error("Seeding error", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
