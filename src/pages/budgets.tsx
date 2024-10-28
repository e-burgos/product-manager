import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Download, Share2, MonitorCog, ArrowBigRight } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import useBudgetData from "../hooks/use-budget-data";
import { useNavigate } from "react-router-dom";
import useBudgetColumns from "@/hooks/use-budget-columns";
import AddBudgetModal from "@/components/modals/budgets/add-budget-modal";

export default function Budgets() {
  const { columns } = useBudgetColumns();
  const { budgets, exportToExcel, shareData } = useBudgetData();
  const navigate = useNavigate();

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="flex justify-between items-center mb-8 gap-2">
        <div className="flex items-center gap-2">
          <MonitorCog className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Presupuestos</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={exportToExcel}
            title="Exportar a Excel"
            className="p-2"
          >
            <Download className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={shareData}
            title="Compartir"
            className="p-2"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <AddBudgetModal />
          <Button onClick={() => navigate("/products")}>
            Productos
            <ArrowBigRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
      <DataTable type="budget" columns={columns} data={budgets || []} />
      <Toaster />
    </ThemeProvider>
  );
}
