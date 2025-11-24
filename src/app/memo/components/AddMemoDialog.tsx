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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Item } from "../types";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddMemoDialogProps {
  categories: string[];
  onAdd: (newItem: Omit<Item, "id">) => void;
  children?: React.ReactNode;
}

export function AddMemoDialog({
  categories,
  onAdd,
  children,
}: AddMemoDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("기본");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!content) return;

    onAdd({
      title: title || t.memo.default_title,
      content,
      category,
      createdAt: new Date().toISOString(),
    });

    setTitle("");
    setContent("");
    setCategory("기본");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className="w-14 h-14 rounded-full bg-black hover:bg-black/90 transition-all duration-300 hover:scale-110"
            size="icon"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V20M4 12H20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col">
        <form onSubmit={handleSubmit} className="contents">
          <DialogHeader>
            <DialogTitle>{t.dialog.add_memo.title}</DialogTitle>
            <DialogDescription>{t.dialog.add_memo.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 flex-1 overflow-y-auto min-h-0 px-1">
            <div className="grid gap-2">
              <Textarea
                placeholder={t.dialog.add_memo.content_placeholder}
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
                  <SelectValue placeholder={t.dialog.add_memo.category_placeholder} />
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
              onClick={() => setOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={!content}>
              {t.common.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
