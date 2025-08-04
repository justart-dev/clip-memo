import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Item } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { linkify } from "../utils/linkify";

interface ViewMemoDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewMemoDialog({
  item,
  open,
  onOpenChange,
}: ViewMemoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] w-[90vw] max-h-[80vh] min-h-[280px]">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[65vh] min-h-[180px] pr-4">
          <div className="text-base leading-relaxed text-gray-600 whitespace-pre-wrap dark:text-gray-300">
            {linkify(item.content)}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
