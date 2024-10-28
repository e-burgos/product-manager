import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetForm } from "../../forms/budgets/budget-form";
import { BudgetDetailsForm } from "../../forms/budgets/budget-detail-form";

const AddBudgetModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Presupuesto</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="budget" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="budget">Presupuestos</TabsTrigger>
            <TabsTrigger value="detail">Nuevo Detalle</TabsTrigger>
          </TabsList>
          <TabsContent value="budget">
            <BudgetForm />
          </TabsContent>
          <TabsContent value="detail">
            <BudgetDetailsForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetModal;
