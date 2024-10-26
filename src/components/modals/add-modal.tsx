import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/product-form";
import { VariantForm } from "@/components/variant-form";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AddModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="product" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product">Producto</TabsTrigger>
            <TabsTrigger value="variant">Variante</TabsTrigger>
          </TabsList>
          <TabsContent value="product">
            <ProductForm />
          </TabsContent>
          <TabsContent value="variant">
            <VariantForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
