import Fastify from "fastify";
import { productRoutes } from "./modules/products/product.routes.js";
import { inventoryRoutes } from "./modules/inventory/inventory.routes.js";
import cors from "@fastify/cors"

const app = Fastify();

await app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(inventoryRoutes);
app.register(productRoutes);

app.get("/", async () => {
    return { message: "API running 🚀"  };
});

app.listen({port: 3000}, (err, address) => {
    if(err){
        console.error(err);
        process.exit(1);
    }
    console.log(`Server running at ${address}`);
})
