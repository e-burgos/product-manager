import { db, Variant } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import * as XLSX from "xlsx";
import { useToast } from "./use-toast";

export interface Product {
  variants: Variant[];
  totalAmount: number;
  id?: number;
  title: string;
  description: string;
}

export type Products = Product[] | undefined;

const useData = () => {
  const { toast } = useToast();

  const products: Products = useLiveQuery(async () => {
    const products = await db.products.toArray();
    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        const variants = await db.variants
          .where("productId")
          .equals(product.id!)
          .toArray();
        const totalAmount = variants.reduce(
          (sum, variant) => sum + variant.amount,
          0
        );
        return {
          ...product,
          variants,
          totalAmount,
        };
      })
    );
    return productsWithVariants;
  });

  const exportToExcel = () => {
    if (!products) return;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      products.map((product) => ({
        Producto: product.title,
        Descripción: product.description,
        "Monto Total": product.totalAmount,
        Variantes: product.variants
          .map(
            (v) =>
              `${v.title} (${new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(v.amount)})`
          )
          .join(", "),
      }))
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    XLSX.writeFile(workbook, "productos.xlsx");
  };

  const shareData = async () => {
    if (!products) return;

    const shareText = products
      .map(
        (product) =>
          `${product.title}\n${
            product.description
          }\nTotal: ${new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(product.totalAmount || 0)}\n\nVariantes:\n${product.variants
            .map(
              (v) =>
                `- ${v.title}: ${new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(v.amount)}`
            )
            .join("\n")}\n\n`
      )
      .join("---\n\n");

    try {
      await navigator.share({
        title: "Lista de Productos",
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
    products,
    exportToExcel,
    shareData,
  };
};

export default useData;
