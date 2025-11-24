import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddCategoryDialogProps {
  onAdd: (category: string) => void;
  children: ReactNode;
  categories: string[];
}

export function AddCategoryDialog({
  onAdd,
  children,
  categories,
}: AddCategoryDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");

  const isDuplicate =
    category.trim() !== "" && categories.includes(category.trim());

  const handleSubmit = () => {
    if (!category || isDuplicate) return;

    onAdd(category.trim());
    setCategory("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.dialog.category.add}</DialogTitle>
          <DialogDescription>
            {t.dialog.category.add_description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder={t.dialog.category.placeholder}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            {isDuplicate && (
              <p className="text-sm text-red-500">
                {t.dialog.category.duplicate_error}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={!category || isDuplicate}>
            {t.common.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
