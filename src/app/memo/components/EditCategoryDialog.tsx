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
            <DialogTitle>카테고리 수정</DialogTitle>
            <DialogDescription>
              {editableCategories.length > 0
                ? "수정할 카테고리를 선택하고 새로운 이름을 입력하세요."
                : "현재 수정 가능한 카테고리가 없습니다."}
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
                      <SelectValue placeholder="카테고리 선택" />
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
                      placeholder="새로운 카테고리 이름"
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
                  새로운 카테고리를 추가한 후 수정할 수 있습니다.
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {editableCategories.length > 0 ? "취소" : "확인"}
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
                수정하기
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
