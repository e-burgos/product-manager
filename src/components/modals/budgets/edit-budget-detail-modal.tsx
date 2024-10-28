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
import { BudgetVariant } from "@/lib/db";
import { EditBudgetDetailForm } from "@/components/forms/budgets/edit-budget-detail-form";

interface EditBudgetDetailModalProps {
  detail: BudgetVariant;
}

const EditBudgetDetailModal: FC<EditBudgetDetailModalProps> = ({ detail }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Editar Detalle ${detail.title}`}</DialogTitle>
        </DialogHeader>
        {detail?.id && <EditBudgetDetailForm budgetDetail={detail} />}
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetDetailModal;
