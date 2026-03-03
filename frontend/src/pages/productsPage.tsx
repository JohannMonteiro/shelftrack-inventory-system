import { ProductList } from "../features/products/productList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../features/products/product.api";
import { toast } from "sonner";
import { Search } from "lucide-react";



export function ProductsPage(){
    const [name, setName] = useState("");
const [sku, setSku] = useState("");

const queryClient = useQueryClient();

const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        setName("");
        setSku("");

        toast.success("Product created");
    },
    onError: () => {
        toast.error("Failed to create product");
    },
})

const [search, setSearch] = useState("");


    return (
       <div className="min-h-screen bg-gray-50">
  <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">

    <div>
      <h1 className="text-3xl font-bold">Inventory</h1>
      <p className="text-sm text-muted-foreground">
        Manage your products and stock
      </p>
    </div>

    {/* Create form */}
    <div className="flex gap-2">
      <Input
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <Input
    placeholder="SKU"
    value={sku}
    onChange={(e) => setSku(e.target.value)}
  />

  <Button
    onClick={() => mutation.mutate({ name, sku })}
    disabled={mutation.isPending || !name || !sku}
  >
    Create
  </Button>
    </div>

    {/* Search */}
       <div className="relative max-w-sm">
    <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
    <Input
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-8"
    />
  </div>
    <ProductList search={search}/>
  </div>
</div>
    );
}
