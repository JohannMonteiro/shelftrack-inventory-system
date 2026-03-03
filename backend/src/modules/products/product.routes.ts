import type { FastifyInstance } from "fastify";
import { createProductHandler, deleteProductController, getProductsHandler, getProductStockHandler, updateProductController } from "./product.controller.js";

export async function productRoutes(app: FastifyInstance) {
    app.get("/products", getProductsHandler);
    //app.get("/products/:id", getProductsHandler);
    app.get("/products/:id/stock", getProductStockHandler);
    app.post("/products", createProductHandler);
    app.delete("/products/:id", deleteProductController);
    app.put("/products/:id", updateProductController);
}