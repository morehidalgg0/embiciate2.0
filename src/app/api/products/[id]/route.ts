import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionAdminId } from "@/lib/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT: Updates an existing product (Protected)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json(
        { error: "No autorizado. Iniciá sesión." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, brand, category, price, stock, imageUrl, rodado, velocidades, frenos, active } = body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        brand: brand !== undefined ? brand : existingProduct.brand,
        category: category !== undefined ? category : existingProduct.category,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        stock: stock !== undefined ? parseInt(stock, 10) : existingProduct.stock,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        rodado: category === "BICICLETA" ? (rodado !== undefined ? rodado : existingProduct.rodado) : null,
        velocidades: category === "BICICLETA" ? (velocidades !== undefined ? velocidades : existingProduct.velocidades) : null,
        frenos: category === "BICICLETA" ? (frenos !== undefined ? frenos : existingProduct.frenos) : null,
        active: active !== undefined ? Boolean(active) : existingProduct.active,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE: Deletes a product (Protected)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json(
        { error: "No autorizado. Iniciá sesión." },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
