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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DeleteCategoryDialogProps {
  categories: string[];
  onDelete: (category: string) => void;
  children: ReactNode;
}

export function DeleteCategoryDialog({
  categories,
  onDelete,
  children,
}: DeleteCategoryDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const deletableCategories = categories.filter(
    (cat) => cat !== "전체" && cat !== "기본"
  );

  const handleSubmit = () => {
    if (!selectedCategory) return;
    onDelete(selectedCategory);
    setSelectedCategory("");
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedCategory("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.dialog.category.delete}</DialogTitle>
          <DialogDescription>
            {deletableCategories.length > 0
              ? t.dialog.category.delete_description
              : t.dialog.category.delete_empty}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            {deletableCategories.length > 0 ? (
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.dialog.edit_memo.category_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {deletableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="py-4 text-sm text-center text-muted-foreground">
                {t.dialog.category.delete_hint}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {deletableCategories.length > 0 ? t.common.cancel : t.common.confirm}
          </Button>
          {deletableCategories.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={!selectedCategory}
            >
              {t.common.delete}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
