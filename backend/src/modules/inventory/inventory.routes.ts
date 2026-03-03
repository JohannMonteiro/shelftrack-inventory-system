import type { FastifyInstance } from "fastify";
import { createMovementHandler } from "./inventory.controller.js";

export async function inventoryRoutes(app: FastifyInstance) {
    app.post("/inventory/movement", createMovementHandler);
}