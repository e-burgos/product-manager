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
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres.",
  }),
  description: z.string(),
});

export function EditBudgetForm({ budgetId }: { budgetId: number }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    async function loadBudgets() {
      const budget = await db.budgets.get(budgetId);
      if (budget) {
        form.reset({
          title: budget.title,
          description: budget.description,
        });
      }
    }
    loadBudgets();
  }, [budgetId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await db.budgets.update(budgetId, {
        title: values.title,
        description: values.description,
      });
      form.reset();
      toast({
        title: "Presupuesto actualizado",
        description: "El presupuesto se ha actualizado correctamente.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el presupuesto.",
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
                <Input placeholder="Nombre del presupuesto" {...field} />
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
                <Textarea
                  placeholder="Descripción del presupuesto"
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
