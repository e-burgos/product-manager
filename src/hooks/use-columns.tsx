import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import { Product } from "./use-data";
import EditProductModal from "@/components/modals/edit-product-modal";
import DeleteProduct from "@/components/modals/delete-product";

const useColumns = () => {
  const columns: ColumnDef<Product>[] = [
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
      header: "Producto",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{row.getValue("title")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "totalAmount",
      header: "Monto Total",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"));
        const formatted = new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(amount);
        return formatted;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      size: 50,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-2">
            <DeleteProduct product={product} />
            <EditProductModal product={product} />
          </div>
        );
      },
    },
  ];
  return { columns };
};

export default useColumns;
