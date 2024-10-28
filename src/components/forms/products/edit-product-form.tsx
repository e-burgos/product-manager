import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/db";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres.",
  }),
  description: z.string(),
});

export function EditProductForm({ productId }: { productId: number }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    async function loadProduct() {
      const product = await db.products.get(productId);
      if (product) {
        form.reset({
          title: product.title,
          description: product.description,
        });
      }
    }
    loadProduct();
  }, [productId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await db.products.update(productId, {
        title: values.title,
        description: values.description,
      });
      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado correctamente.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar el producto.",
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
                <Input placeholder="Nombre del producto" {...field} />
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
                <Textarea placeholder="Descripción del producto" {...field} />
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
