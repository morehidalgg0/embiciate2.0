import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSessionAdminId } from "@/lib/auth";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const maxFileSize = 5 * 1024 * 1024;

function safeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function POST(request: Request) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json(
        { error: "No autorizado. Iniciá sesión." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Seleccioná una imagen para subir" },
        { status: 400 }
      );
    }

    const extension = allowedTypes.get(file.type);
    if (!extension) {
      return NextResponse.json(
        { error: "Formato inválido. Usá JPG, PNG, WEBP o GIF." },
        { status: 400 }
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "La imagen no puede superar los 5 MB" },
        { status: 400 }
      );
    }

    const originalName = safeFilename(file.name || `imagen.${extension}`);
    const filename = `uploads/${randomUUID()}-${originalName}`;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Falta configurar BLOB_READ_WRITE_TOKEN en el servidor" },
          { status: 500 }
        );
      }

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(process.cwd(), "public", filename), buffer);
      return NextResponse.json({ url: `/${filename}` });
    }

    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error uploading image:", error);
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json(
      { error: message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
