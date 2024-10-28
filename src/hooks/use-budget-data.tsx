import { Budgets, db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import * as XLSX from "xlsx";
import { useToast } from "./use-toast";
import { formatCurrency } from "@/lib/utils";

const useData = () => {
  const { toast } = useToast();

  const budgets: Budgets = useLiveQuery(async () => {
    const budgets = await db.budgets.toArray();
    const budgetsWithVariants = await Promise.all(
      budgets.map(async (budget) => {
        const variants = await db.budgetVariants
          .where("budgetId")
          .equals(budget.id!)
          .toArray();
        const totalAmount = variants.reduce(
          (sum, variant) => sum + variant.amount,
          0
        );
        return {
          ...budget,
          variants,
          totalAmount,
        };
      })
    );
    return budgetsWithVariants;
  });

  const budgetVariants = useLiveQuery(() => db.budgetVariants.toArray());

  const getBudgetDetails = (budgetId: number | undefined) =>
    budgetVariants?.filter((v) => v.budgetId === budgetId);

  const exportToExcel = () => {
    if (!budgets) return;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      budgets.map((budget) => ({
        Presupuesto: budget.title,
        Descripción: budget.description || "-",
        "Monto Total": formatCurrency(budget.totalAmount || 0),
        Detalles: getBudgetDetails(budget.id)
          ?.map(
            (v) =>
              `Producto: ${v.title}, Cantidad: ${
                v.quantity
              }, Subtotal: ${formatCurrency(v.amount)}`
          )
          .join("| "),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, "Presupuestos");
    XLSX.writeFile(workbook, "presupuestos.xlsx");
  };

  const shareData = async () => {
    if (!budgets) return;

    const shareText = budgets
      .map(
        (budget) =>
          `Presupuesto: ${budget.title}\n
          Descripción: ${budget.description || "-"}\n
          Total: ${new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(budget.totalAmount || 0)}\n\nDetalles:\n${getBudgetDetails(
            budget.id
          )
            ?.map(
              (v) =>
                `- Producto: ${v.title} (${
                  v.quantity
                } unidades): ${new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(v.amount)}`
            )
            .join("\n")}\n\n`
      )
      .join("---\n\n");

    try {
      await navigator.share({
        title: "Lista de Presupuestos",
        text: shareText,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "No se pudo compartir. Intenta copiar el contenido manualmente.",
      });
    }
  };
  return {
    budgets,
    exportToExcel,
    shareData,
  };
};

export default useData;
