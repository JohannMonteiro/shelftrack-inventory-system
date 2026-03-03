import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStock, createMovement, deleteProduct, updateProduct } from "./product.api";
import type { Product } from "./product.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { Separator } from "@/components/ui/separator";

export function ProductItem({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["stock", product.id],
    queryFn: () => getStock(product.id),
  });

  const mutation = useMutation<
    unknown,
    AxiosError<{ message: string }>,
    { productId: string; type: "IN" | "OUT"; quantity: number }
  >({
    mutationFn: createMovement,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stock", product.id] });
      setQuantity(1); //reset input

      toast.success(
        variables.type === "IN"
          ? `Added ${variables.quantity}`
          : `Removed ${variables.quantity}`,
      );
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const deleteMutation = useMutation<
    unknown,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (error) => {
      //toast.error("Failed to delete product");
      console.log("DELETE ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });

  function addStock() {
    mutation.mutate({
      productId: product.id,
      type: "IN",
      quantity,
    });
  }

  function removeStock() {
    mutation.mutate({
      productId: product.id,
      type: "OUT",
      quantity,
    });
  }

  const[isEditing, setIsEditing] = useState(false);
  const[editName, setEditName] = useState(product.name);
  const[editSku, setEditSku] = useState(product.sku);

  const updateMutation = useMutation({
  mutationFn: (data: { name: string; sku: string }) =>
    updateProduct(product.id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    setIsEditing(false);
    toast.success("Product updated");
  },
});



  return (
    <Card className="shadow-sm border bg-white hover:shadow-xl transition duration-300">
  <CardContent className="p-5 space-y-4">

    {/* Header */}
    {isEditing ? (
  <div className="space-y-2">
    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
    <Input value={editSku} onChange={(e) => setEditSku(e.target.value)} />
  </div>
) : (
  <div className="space-y-1">
    <div className="text-xl font-semibold">{product.name}</div>
    <div className="text-xs text-muted-foreground uppercase">
      {product.sku}
    </div>
  </div>
)}

    <Separator />

    {/* Stock */}
    <div className="bg-muted/40 rounded-lg p-3">
      <div className="text-xs text-muted-foreground">Stock</div>
      <div className="text-3xl font-bold">
        {isLoading ? "..." : data?.stock ?? 0}
      </div>
    </div>

    <Separator />

    {/* Actions */}
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value > 0) setQuantity(value);
          }}
          className="w-16 text-center"
        />

        <Button
  onClick={addStock}
  disabled={mutation.isPending}
  className="flex-1"
>
  <Plus className="w-4 h-4 mr-1" />
  Add
</Button>

<Button
  variant="destructive"
  onClick={removeStock}
  disabled={mutation.isPending || data?.stock === 0}
  className="flex-1"
>
  <Minus className="w-4 h-4 mr-1" />
  Remove
</Button>
      </div>

      <Button
        variant="ghost"
        onClick={() => {
          if (confirm("Delete this product?")) {
            deleteMutation.mutate(product.id);
          }
        }}
        className="w-full text-muted-foreground hover:text-destructive"
      >
        <Trash className="w-4 h-4 mr-1" />
        Delete
      </Button>
      {isEditing ? (
  <div className="flex gap-2">
    <Button
      onClick={() =>
        updateMutation.mutate({ name: editName, sku: editSku })
      }
    >
      Save
    </Button>

    <Button variant="ghost" onClick={() => setIsEditing(false)}>
      Cancel
    </Button>
  </div>
) : (
  <Button variant="secondary" onClick={() => setIsEditing(true)}>
    Edit
  </Button>
)}
    </div>
    

  </CardContent>
</Card>
  );
}
