import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Budget, BudgetVariant, db, Variant, type Product } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";
import { formatCurrency } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  budgetId: z.string(),
  productId: z.string(),
  variantId: z.string(),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "La cantidad debe ser un número mayor a 0.",
  }),
});

export function EditBudgetDetailForm({
  budgetDetail,
}: {
  budgetDetail: BudgetVariant;
}) {
  const { toast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<Variant>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgetId: budgetDetail.budgetId.toString(),
      productId: budgetDetail.productId.toString(),
      variantId: budgetDetail.variantId.toString(),
      quantity: budgetDetail.quantity.toString(),
    },
  });

  const { watch } = form;
  const productId = watch("productId");
  const quantity = watch("quantity");

  const budgets = useLiveQuery(() => db.budgets.toArray());
  const products = useLiveQuery(() => db.products.toArray());
  const variants = useLiveQuery(() => db.variants.toArray())?.filter(
    (v) => v.productId === Number(productId)
  );

  useEffect(() => {
    async function loadBudgetDetail() {
      if (budgetDetail) {
        const variant = await db.variants.get(budgetDetail?.variantId);
        setSelectedVariant(variant);
        if (variant) {
          form.reset({
            budgetId: budgetDetail.budgetId.toString(),
            productId: budgetDetail.productId.toString(),
            variantId: budgetDetail.variantId.toString(),
            quantity: budgetDetail.quantity.toString(),
          });
        }
      }
    }
    loadBudgetDetail();
  }, [budgetDetail, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (selectedVariant?.id && budgetDetail?.id) {
        await db.budgetVariants.update(budgetDetail?.id, {
          budgetId: budgetDetail.budgetId,
          variantId: Number(selectedVariant?.id),
          title: selectedVariant?.title,
          description: selectedVariant?.description,
          quantity: Number(values.quantity),
          amount: Number(selectedVariant?.amount) * Number(values.quantity),
        });
        form.reset();
        toast({
          title: "Detalle actualizado",
          description: "El detalle se actualizó correctamente.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el detalle.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="budgetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presupuestos</FormLabel>
              <Select
                disabled
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un presupuesto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {budgets?.map((budget: Budget) => (
                    <SelectItem
                      key={budget.id}
                      value={budget.id?.toString() || ""}
                    >
                      {budget.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {budgetDetail.budgetId && (
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Productos</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={productId}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products?.map((product: Product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id?.toString() || ""}
                      >
                        {product.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {productId && variants?.length && (
          <FormField
            control={form.control}
            name="variantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variante de Producto</FormLabel>
                <Select
                  onValueChange={(value) => {
                    setSelectedVariant(
                      variants?.find((p) => p.id === parseInt(value))
                    );
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {variants?.map((variant: Variant) => (
                      <SelectItem
                        key={variant.id}
                        value={variant.id?.toString() || ""}
                      >
                        {variant.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {selectedVariant?.id && (
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese un valor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {selectedVariant?.id && quantity && (
          <Card className="p-2">
            <Label className="p-2">Detalle</Label>
            <Input
              className="mt-2"
              value={`Nombre: ${selectedVariant?.title}`}
              disabled
            />
            <Input
              value={`Descripción: ${selectedVariant?.description}`}
              disabled
            />
            <Input
              value={`Monto Total: ${formatCurrency(
                selectedVariant?.amount * Number(quantity)
              )}`}
              disabled
            />
          </Card>
        )}
        <DialogClose asChild>
          <Button type="submit">Actualizar</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
