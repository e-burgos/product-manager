import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FC } from "react";
import { Budget } from "@/lib/db";
import { EditBudgetForm } from "@/components/forms/budgets/edit-budget-form";

interface EditBudgetModalProps {
  budget: Budget;
}

const EditBudgetModal: FC<EditBudgetModalProps> = ({ budget }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Editar ${budget.title}`}</DialogTitle>
        </DialogHeader>
        {budget?.id && <EditBudgetForm budgetId={budget.id} />}
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetModal;
