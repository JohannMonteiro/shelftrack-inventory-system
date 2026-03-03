import { prisma } from "../../lib/prisma.js";
import {PrismaClient, Prisma} from "@prisma/client";

export async function createMovement(data: {
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
}) {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Check if product exists
    const product = await tx.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // 2️⃣ If OUT, validate stock
    if (data.type === "OUT") {
      const stock = await getStock(data.productId, tx);

      if (stock < data.quantity) {
        throw new Error("Insufficient stock");
      }
    }

    // 3️⃣ Create movement
    const movement = await tx.inventoryMovement.create({
      data,
    });

    return movement;
  });
}

export async function getStock(
    productId: string, 
    tx : Prisma.TransactionClient | PrismaClient = prisma) {
  const result = await tx.inventoryMovement.groupBy({
    by: ["type"],
    where: {
      productId,
    },
    _sum: {
      quantity: true,
    },
  });

  const inQty = result.find((r) => r.type === "IN")?._sum.quantity || 0;
  const outQty = result.find((r) => r.type === "OUT")?._sum.quantity || 0;

  return inQty - outQty;
}
