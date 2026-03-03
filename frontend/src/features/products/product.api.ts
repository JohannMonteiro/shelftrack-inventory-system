import {api} from "../../api/client"
import type { Product } from "./product.type";

export async function getProducts(): Promise<Product[]> {
    const res = await api.get('/products');
    return res.data;
}

export async function getStock(productId: string) {
    const res = await api.get(`/products/${productId}/stock`);
    return res.data;
}

export async function createMovement(data:{
    productId: string,
    type: "IN" | "OUT",
    quantity: number,
}) {
    const res = await api.post("inventory/movement", data);
    return res.data;
}

export async function createProduct(data:{ name: string; sku: string; }) {
    const res = await api.post("/products", data);
    return res.data;
}

export async function deleteProduct(productId: string) {
    const res = await api.delete(`/products/${productId}`);
    return res.data;
}

export async function updateProduct(
    productId: string,
    data: { name: string; sku: string; }
) {
    const res = await api.put(`/products/${productId}`, data);
    return res.data;
}