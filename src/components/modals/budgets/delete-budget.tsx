import React from "react";
import { Budget, db } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteBudgetProps {
  budget: Budget;
}

const DeleteBudget: React.FC<DeleteBudgetProps> = ({ budget }) => {
  const { toast } = useToast();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={async () => {
        if (
          window.confirm(
            "¿Estás seguro de que deseas eliminar este presupuesto?"
          )
        ) {
          await db.budgetVariants.where("budgetId").equals(budget.id!).delete();
          await db.budgets.delete(budget.id!);
          toast({
            title: "Presupuesto eliminado",
            description: "El presupuesto y sus detalles han sido eliminados.",
          });
        }
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
};

export default DeleteBudget;
