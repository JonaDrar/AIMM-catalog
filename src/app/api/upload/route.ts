import { getServerSession } from "next-auth/next";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Acceso no autorizado" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Faltan credenciales de Cloudinary" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "Se necesita un archivo para subir" },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "catalogo",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error("No se pudo cargar la imagen"));
          }
          return resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json(
      { url: uploadResult.secure_url, publicId: uploadResult.public_id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Cloudinary upload error", error);
    return NextResponse.json(
      { error: "No se pudo subir la imagen" },
      { status: 500 }
    );
  }
}
