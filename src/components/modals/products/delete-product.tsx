import React from "react";
import { db, Product } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteProductProps {
  product: Product;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({ product }) => {
  const { toast } = useToast();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={async () => {
        if (
          window.confirm("¿Estás seguro de que deseas eliminar este producto?")
        ) {
          await db.variants.where("productId").equals(product.id!).delete();
          await db.products.delete(product.id!);
          toast({
            title: "Producto eliminado",
            description: "El producto y sus variantes han sido eliminados.",
          });
        }
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
};

export default DeleteProduct;
