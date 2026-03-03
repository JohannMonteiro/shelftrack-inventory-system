import {z} from "zod";

export const createMovementSchema = z.object({
    productId: z.uuid(),
    type: z.enum(["IN", "OUT"]),
    quantity: z.number().int().positive(),
})