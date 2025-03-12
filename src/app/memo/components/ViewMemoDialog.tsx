import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Item } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 text-base">
            {item.content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
