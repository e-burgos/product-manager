import React from "react";
import { BudgetVariant, db } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteDetailProps {
  detail: BudgetVariant;
}

const DeleteDetail: React.FC<DeleteDetailProps> = ({ detail }) => {
  const { toast } = useToast();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="mr-2"
      onClick={async () => {
        if (
          window.confirm("¿Estás seguro de que deseas eliminar este detalle?")
        ) {
          if (detail.id) {
            await db.budgetVariants.delete(detail.id);
            toast({
              title: "Detalle eliminado",
              description: "El detalle han sido eliminado.",
            });
          }
        }
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
};

export default DeleteDetail;
