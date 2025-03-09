import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Item } from "../types";

interface EditMemoDialogProps {
  item: Item;
  categories: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (editedItem: Item) => void;
}

export function EditMemoDialog({
  item,
  categories,
  open,
  onOpenChange,
  onEdit,
}: EditMemoDialogProps) {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [category, setCategory] = useState(item.category);

  useEffect(() => {
    if (open) {
      setTitle(item.title);
      setContent(item.content);
      setCategory(item.category);
    }
  }, [open, item]);

  const handleSubmit = () => {
    if (!title || !content) return;

    onEdit({
      ...item,
      title,
      content,
      category,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>메모 수정</DialogTitle>
          <DialogDescription>
            메모의 내용을 수정하세요. 모든 필드를 채워주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[140px]"
            />
          </div>
          <div className="grid gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !content}>
            수정하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
