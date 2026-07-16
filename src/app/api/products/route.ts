import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionAdminId } from "@/lib/auth";

// GET: Returns all products (for the admin dashboard if authenticated, or public if needed)
export async function GET() {
  try {
    const adminId = await getSessionAdminId();
    
    // If not authenticated, only return active products
    if (!adminId) {
      const activeProducts = await prisma.product.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(activeProducts);
    }

    // If authenticated admin, return all products (including inactive)
    const allProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST: Creates a new product (Protected)
export async function POST(request: Request) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json(
        { error: "No autorizado. Iniciá sesión." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, brand, category, price, stock, imageUrl, rodado, velocidades, frenos, active } = body;

    // Validation
    if (!name || !brand || !category || price === undefined || stock === undefined || !imageUrl) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados" },
        { status: 400 }
      );
    }

    if (category !== "BICICLETA" && category !== "ACCESORIO") {
      return NextResponse.json(
        { error: "Categoría inválida" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        category,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        imageUrl,
        rodado: category === "BICICLETA" ? rodado || null : null,
        velocidades: category === "BICICLETA" ? velocidades || null : null,
        frenos: category === "BICICLETA" ? frenos || null : null,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
