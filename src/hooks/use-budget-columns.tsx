import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import { Budget } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import DeleteBudget from "@/components/modals/budgets/delete-budget";
import EditBudgetModal from "@/components/modals/budgets/edit-budget-modal";

const useBudgetColumns = () => {
  const columns: ColumnDef<Budget>[] = [
    {
      accessorKey: "expanded",
      header: "",
      size: 10,
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => row.toggleExpanded()}
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Presupuesto",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{row.getValue("title") || "-"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Descripción",
      size: 500,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span>{row.getValue("description") || "-"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Monto Total",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"));
        return formatCurrency(amount) || formatCurrency(0);
      },
    },
    {
      id: "actions",
      header: "Acciones",
      size: 50,
      cell: ({ row }) => {
        const budget = row.original;
        return (
          <div className="flex gap-2">
            <DeleteBudget budget={budget} />
            <EditBudgetModal budget={budget} />
          </div>
        );
      },
    },
  ];
  return { columns };
};

export default useBudgetColumns;
