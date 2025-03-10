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
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const deletableCategories = categories.filter(
    (cat) => cat !== "전체" && cat !== "기본"
  );

  const handleSubmit = () => {
    if (!selectedCategory) return;
    onDelete(selectedCategory);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>카테고리 삭제</DialogTitle>
          <DialogDescription>
            {deletableCategories.length > 0
              ? "삭제할 카테고리를 선택하세요. 선택한 카테고리에 메모가 존재한다면 기본 카테고리로 이동합니다."
              : "현재 삭제 가능한 카테고리가 없습니다. 기본 카테고리는 삭제할 수 없습니다."}
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
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat !== "전체")
                    .map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        disabled={cat === "기본"}
                        className={
                          cat === "기본" ? "opacity-50 cursor-not-allowed" : ""
                        }
                      >
                        {cat === "기본" ? `${cat} (삭제 불가)` : cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="py-4 text-sm text-center text-muted-foreground">
                새로운 카테고리를 추가한 후 삭제할 수 있습니다.
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {deletableCategories.length > 0 ? "취소" : "확인"}
          </Button>
          {deletableCategories.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={!selectedCategory}
            >
              삭제
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
