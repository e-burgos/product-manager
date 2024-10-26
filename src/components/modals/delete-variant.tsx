import React from "react";
import { Button } from "../ui/button";
import { db, Variant } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface DeleteVariantProps {
  variant: Variant;
}

const DeleteVariant: React.FC<DeleteVariantProps> = ({ variant }) => {
  const { toast } = useToast();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="mr-2"
      onClick={async () => {
        if (
          window.confirm("¿Estás seguro de que deseas eliminar este variante?")
        ) {
          if (variant.id) {
            await db.variants.delete(variant.id);
            toast({
              title: "Variante eliminada",
              description: "La variante han sido eliminados.",
            });
          }
        }
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
};

export default DeleteVariant;
