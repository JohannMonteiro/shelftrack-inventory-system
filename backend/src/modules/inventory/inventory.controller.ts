import type { FastifyReply, FastifyRequest } from "fastify";
import { createMovementSchema } from "./inventory.schema.js";
import * as inventoryService from "./inventory.service.js";

export async function createMovementHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const parsed = createMovementSchema.safeParse(request.body);

    if (!parsed.success) {
        return reply.status(400).send({
           error: parsed.error.issues,
        });
    }

    try{
        const movement = await inventoryService.createMovement(parsed.data);
        return reply.send(movement);
    } catch (err: any) {
        return reply.status(400).send({ message: err.message });
    }
}