import { getStock } from "../inventory/inventory.service.js";
import { prisma } from "../../lib/prisma.js";

export async function createProduct(data:{
    name: string;
    sku: string;
}) {
    return prisma.product.create({
        data
    });
}

export async function getProducts() {
    return prisma.product.findMany();
}

export async function getProductById(id: string) {
    return prisma.product.findUnique({where: {id}});
}

export async function getProductStock(productId: string) {
    const product = await prisma.product.findUnique({where: {id: productId}});

    if (!product){
        throw new Error("Product not found");
    }

    const stock = await getStock(productId);

    return{
        productId,
        stock,
    }
}

export async function deleteProduct(id: string) {
    //1. delete all movements
    await prisma.inventoryMovement.deleteMany({where: {productId: id}});

    //2. delete product
    return prisma.product.delete({where: {id}});
}

export async function updateProduct(id: string, data: {name: string, sku: string}) {
    return prisma.product.update({where: {id}, data});
}