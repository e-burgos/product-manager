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
import { Budget, db, Variant, type Product } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
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

export function BudgetDetailsForm() {
  const { toast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<Variant>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgetId: "",
      productId: "",
      variantId: "",
      quantity: "",
    },
  });

  const { watch } = form;
  const budgetId = watch("budgetId");
  const productId = watch("productId");
  const quantity = watch("quantity");

  const budgets = useLiveQuery(() => db.budgets.toArray());
  const products = useLiveQuery(() => db.products.toArray());
  const variants = useLiveQuery(() => db.variants.toArray())?.filter(
    (v) => v.productId === Number(productId)
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (selectedVariant?.id) {
        await db.budgetVariants.add({
          budgetId: Number(values.budgetId),
          productId: Number(values.productId),
          variantId: Number(values.variantId),
          title: selectedVariant?.title,
          description: selectedVariant?.description,
          quantity: Number(values.quantity),
          amount: Number(selectedVariant?.amount) * Number(values.quantity),
        });
        form.reset();
        toast({
          title: "Detalle creada",
          description: "El detalle se ha creado correctamente.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el detalle.",
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {budgetId && (
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Productos</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
        {variants?.length === 0 && (
          <FormItem>
            <p className="text-destructive-foreground">
              No se encontraron variantes para este producto.
            </p>
          </FormItem>
        )}
        {productId && variants?.length !== 0 && (
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
          <Button disabled={variants?.length === 0} type="submit">
            Crear
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
