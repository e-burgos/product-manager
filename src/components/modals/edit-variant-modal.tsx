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
import { EditVariantForm } from "../edit-variant-form";
import { Variant } from "@/lib/db";

interface EditVariantModalProps {
  variant: Variant;
}

const EditVariantModal: FC<EditVariantModalProps> = ({ variant }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Editar Variante ${variant.title}`}</DialogTitle>
        </DialogHeader>
        {variant?.id && <EditVariantForm variantId={variant.id} />}
      </DialogContent>
    </Dialog>
  );
};

export default EditVariantModal;
