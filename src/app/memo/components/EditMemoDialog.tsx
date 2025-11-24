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
import { useState, useEffect, useRef } from "react";
import { Item } from "../types";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [category, setCategory] = useState(item.category);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTitle(item.title);
      setContent(item.content);
      setCategory(item.category);
      
      // 모바일에서 키보드 올리기 위해 약간의 지연 후 포커스
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
        }
      }, 100);
    }
  }, [open, item]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!content) return;

    onEdit({
      id: item.id,
      title: title || t.memo.default_title,
      content,
      category,
      createdAt: item.createdAt,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col">
        <form onSubmit={handleSubmit} className="contents">
          <DialogHeader>
            <DialogTitle>{t.dialog.edit_memo.title}</DialogTitle>
            <DialogDescription>
              {t.dialog.edit_memo.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 flex-1 overflow-y-auto min-h-0 px-1">
            <div className="grid gap-2">
              <Input
                placeholder={t.dialog.edit_memo.title_placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Textarea
                ref={contentRef}
                placeholder={t.dialog.edit_memo.content_placeholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                className="resize-none min-h-32"
              />
            </div>
            <div className="grid gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t.dialog.edit_memo.category_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat !== "전체")
                    .map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "기본" ? t.common.default : cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={!content}>
              {t.common.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
