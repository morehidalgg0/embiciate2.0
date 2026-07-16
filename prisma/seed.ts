import { prisma } from "../src/lib/db";
import * as bcrypt from "bcryptjs";

async function main() {
  console.log("Iniciando seed de base de datos...");

  // 1. Limpiar base de datos (opcional para desarrollo limpio)
  await prisma.product.deleteMany({});
  await prisma.admin.deleteMany({});

  // 2. Crear usuario administrador
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.create({
    data: {
      email: "admin@embiciate.com",
      passwordHash: passwordHash,
    },
  });
  console.log(`Admin creado con email: ${admin.email}`);

  // 3. Crear productos iniciales (Bicicletas)
  const bicis = [
    {
      name: "Firebird Col Raiser R29",
      brand: "Firebird",
      category: "BICICLETA",
      price: 299900,
      stock: 5,
      imageUrl: "/images/firebird.jpeg",
      rodado: "29",
      velocidades: "21",
      frenos: "Disco Mecánico",
      active: true,
    },
    {
      name: "Topmega Magma R29",
      brand: "Topmega",
      category: "BICICLETA",
      price: 269900,
      stock: 3,
      imageUrl: "/images/topmega.jpeg",
      rodado: "29",
      velocidades: "21",
      frenos: "Disco Mecánico",
      active: true,
    },
    {
      name: "Raleigh 2.0 R29",
      brand: "Raleigh",
      category: "BICICLETA",
      price: 389900,
      stock: 4,
      imageUrl: "/images/raleigh.jpeg",
      rodado: "29",
      velocidades: "24",
      frenos: "Disco Hidráulico",
      active: true,
    },
  ];

  for (const b of bicis) {
    const created = await prisma.product.create({ data: b });
    console.log(`Bicicleta creada: ${created.name}`);
  }

  // 4. Crear productos iniciales (Accesorios)
  const accesorios = [
    {
      name: "Casco Ciclismo Pro MTB",
      brand: "SLP",
      category: "ACCESORIO",
      price: 25000,
      stock: 10,
      imageUrl: "/images/smart-kassel.jpg", // Usamos smart-kassel como foto de accesorio de prueba
      rodado: null,
      velocidades: null,
      frenos: null,
      active: true,
    },
    {
      name: "Kit de Luces Led Recargables",
      brand: "SLP",
      category: "ACCESORIO",
      price: 12000,
      stock: 15,
      imageUrl: "/images/smart-kassel.jpg",
      rodado: null,
      velocidades: null,
      frenos: null,
      active: true,
    },
    {
      name: "Cadena Antirrobo Reforzada",
      brand: "SLP",
      category: "ACCESORIO",
      price: 18000,
      stock: 8,
      imageUrl: "/images/smart-kassel.jpg",
      rodado: null,
      velocidades: null,
      frenos: null,
      active: true,
    },
  ];

  for (const acc of accesorios) {
    const created = await prisma.product.create({ data: acc });
    console.log(`Accesorio creado: ${created.name}`);
  }

  console.log("Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error("Error ejecutando el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
