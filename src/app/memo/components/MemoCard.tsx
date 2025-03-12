import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit2, Trash } from "lucide-react";
import { ViewMemoDialog } from "./ViewMemoDialog";
import { Item } from "../types";

interface MemoCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onCopy: () => void;
}

export function MemoCard({ item, onEdit, onDelete, onCopy }: MemoCardProps) {
  const [showViewDialog, setShowViewDialog] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    onCopy();
  };

  return (
    <>
      <Card className="relative group">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-8">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap dark:text-gray-300 line-clamp-2">
                {item.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute opacity-0 right-14 top-3 group-hover:opacity-100"
              onClick={handleCopy}
            >
              복사
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="absolute w-8 h-8 p-0 opacity-0 top-2 right-2 group-hover:opacity-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
                <Eye className="w-4 h-4 mr-2" />
                전체보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit2 className="w-4 h-4 mr-2" />
                수정하기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item)}>
                <Trash className="w-4 h-4 mr-2" />
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <ViewMemoDialog
        item={item}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />
    </>
  );
}
