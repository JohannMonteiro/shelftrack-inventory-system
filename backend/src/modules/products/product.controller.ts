import type {FastifyReply, FastifyRequest} from "fastify";
import {createProductSchema} from "./product.schema.js";
import * as productService from "./product.service.js";
import {z} from "zod";
import { deleteProduct } from "./product.service.js";
import {updateProduct} from "./product.service.js";

export async function createProductHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const parsed = createProductSchema.safeParse(request.body);

    if(!parsed.success){
        return reply.status(400).send({
            message: "Validation error",
            errors: z.treeifyError(parsed.error),
        });
}

    const product = await productService.createProduct(parsed.data);
    return reply.send(product);
}

export async function getProductsHandler() {
    return productService.getProducts();
}

export async function getProductByIdHandler(request: FastifyRequest<{Params: {id: string} }>,
    reply: FastifyReply
) {
    const {id} = request.params;
    const product = await productService.getProductById(id);
    if(!product){
        return reply.status(404).send({message: "Product not found"});
    }
    return reply.send(product);
}

export async function getProductStockHandler(
    request: FastifyRequest<{Params: {id: string} }>,
    reply: FastifyReply
) {
    const {id} = request.params;

    try{
        const result = await productService.getProductStock(id);
        return reply.send(result);
    } catch (err: any){
        return reply.status(404).send({message: err.message});
    }
}

export async function deleteProductController(
    request: FastifyRequest<{Params: {id: string} }>,
    reply: FastifyReply
) {
    const {id} = request.params;

    await deleteProduct(id);
    return reply.status(204).send();
}

const updateProductSchema = z.object({
    name: z.string().min(1),
    sku: z.string().min(1),
});

export async function updateProductController(
    request: FastifyRequest<{Params: {id: string} }>,
    reply: FastifyReply
) {
    const {id} = request.params;
    const parsed = updateProductSchema.safeParse(request.body);

    if (!parsed.success) {
        return reply.status(400).send({
            error: parsed.error.issues,
        });
    }
    const updated = await updateProduct(id, parsed.data);
    return reply.send(updated);
}

