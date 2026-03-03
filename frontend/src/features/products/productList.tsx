import {useQuery } from "@tanstack/react-query";
import {getProducts, } from "./product.api.js";
import type { Product } from "./product.type.js";
import { ProductItem } from "./productItem.js";


export function ProductList({search}: {search: string}) {
  const {data, isLoading} = useQuery<Product[]>({
    queryKey:["products"],
    queryFn: getProducts
  });

  const filteredData = data?.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>

  if (!filteredData?.length) {
  return (
    <div className="text-center text-muted-foreground py-10">
      {search
        ? "No matching products found."
        : "No products yet. Create one above."}
    </div>
  );
}

  return (
    

    <div>
      <h2>Products</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {filteredData?.map((p) => (
    <ProductItem key={p.id} product={p} />
  ))}
</div>
    </div>
  );
}

