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

interface EditCategoryDialogProps {
  categories: string[];
  onEdit: (oldCategory: string, newCategory: string) => void;
  children: ReactNode;
}

export function EditCategoryDialog({
  categories,
  onEdit,
  children,
}: EditCategoryDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const editableCategories = categories.filter(
    (cat) => cat !== "전체" && cat !== "기본"
  );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!selectedCategory || !newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) return;

    onEdit(selectedCategory, newCategoryName.trim());
    setSelectedCategory("");
    setNewCategoryName("");
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedCategory("");
      setNewCategoryName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t.dialog.category.edit}</DialogTitle>
            <DialogDescription>
              {editableCategories.length > 0
                ? t.dialog.category.edit_description
                : t.dialog.category.edit_empty}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              {editableCategories.length > 0 ? (
                <>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      setNewCategoryName(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.dialog.edit_memo.category_placeholder || t.common.category} />
                    </SelectTrigger>
                    <SelectContent>
                      {editableCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCategory && (
                    <Input
                      placeholder={t.dialog.category.edit_placeholder}
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="py-4 text-sm text-center text-muted-foreground">
                  {t.dialog.category.edit_hint}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {editableCategories.length > 0 ? t.common.cancel : t.common.confirm}
            </Button>
            {editableCategories.length > 0 && selectedCategory && (
              <Button
                type="submit"
                disabled={
                  !newCategoryName.trim() ||
                  newCategoryName === selectedCategory ||
                  categories.includes(newCategoryName.trim())
                }
              >
                {t.common.save}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
