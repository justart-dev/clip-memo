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
          <DialogTitle>카테고리 추가</DialogTitle>
          <DialogDescription>
            새로운 카테고리 이름을 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="새로운 카테고리 이름"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            {isDuplicate && (
              <p className="text-sm text-red-500">
                이미 존재하는 카테고리입니다.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!category || isDuplicate}>
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
