import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Download, Share2, Package, ArrowBigRight } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import useProductColumns from "../hooks/use-product-columns";
import useProductData from "../hooks/use-product-data";
import AddProductModal from "../components/modals/products/add-product-modal";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const { columns } = useProductColumns();
  const { products, exportToExcel, shareData } = useProductData();
  const navigate = useNavigate();

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
          <AddProductModal />
          <Button onClick={() => navigate("/budgets")}>
            Presupuestos
            <ArrowBigRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
      <DataTable type="product" columns={columns} data={products || []} />
      <Toaster />
    </ThemeProvider>
  );
}
