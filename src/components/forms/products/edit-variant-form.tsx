import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { db, Variant } from "@/lib/db";
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
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  productId: z.string(),
  title: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres.",
  }),
  description: z.string(),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El monto debe ser un número mayor a 0.",
  }),
});

export function EditVariantForm({ variantId }: { variantId: number }) {
  const [variant, setVariant] = useState<Variant>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: variant?.productId.toString() ?? "",
      title: "",
      description: "",
      amount: "",
    },
  });

  useEffect(() => {
    async function loadVariant() {
      const variant = await db.variants.get(variantId);
      if (variant) {
        setVariant(variant);
        form.reset({
          productId: variant.productId.toString(),
          title: variant.title,
          description: variant.description,
          amount: variant.amount.toString(),
        });
      }
    }
    loadVariant();
  }, [variantId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await db.variants.update(variantId, {
        productId: variant?.productId,
        id: variantId,
        title: values.title,
        description: values.description,
        amount: parseFloat(values.amount),
      });
      toast({
        title: "Variante actualizada",
        description: "La variante se ha actualizado correctamente.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar la variante.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button type="submit">Actualizar</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
