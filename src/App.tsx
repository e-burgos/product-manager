import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Download, Share2, Package } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import useColumns from "./hooks/use-columns";
import useData from "./hooks/use-data";
import AddModal from "./components/modals/add-modal";

export default function App() {
  const { columns } = useColumns();
  const { products, exportToExcel, shareData } = useData();

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="flex justify-between items-center mb-8 gap-2">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Gestor de Productos</h1>
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
          <AddModal />
        </div>
      </div>
      <DataTable columns={columns} data={products || []} />
      <Toaster />
    </ThemeProvider>
  );
}
