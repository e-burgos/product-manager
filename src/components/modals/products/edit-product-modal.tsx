import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FC } from "react";
import { Product } from "@/lib/db";
import { EditProductForm } from "@/components/forms/products/edit-product-form";

interface EditProductModalProps {
  product: Product;
}

const EditProductModal: FC<EditProductModalProps> = ({ product }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Editar ${product.title}`}</DialogTitle>
        </DialogHeader>
        {product?.id && <EditProductForm productId={product.id} />}
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
