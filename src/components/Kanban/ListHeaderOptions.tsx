import { toast } from "sonner";
import { MoreHorizontal, X } from "lucide-react";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { deleteList } from "@/actions/kanban/deleteList";
import { copyList } from "@/actions/kanban/copyList";
import { Separator } from "@/components/ui/separator";
import { List } from "@/types";

interface ListHeaderOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListHeaderOptions = ({
  data,
  onAddCard,
}: ListHeaderOptionsProps) => {
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { id, title, boardId } = data;

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied`);
      queryClient.invalidateQueries({ queryKey: ["storage"] });
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: () => {
      toast.success(`List "${title}" deleted`);
      queryClient.invalidateQueries({ queryKey: ["storage"] });
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleAddCard = () => {
    onAddCard();
    closeRef.current?.click();
  };
  const handleCopy = () => {
    executeCopy({ id, boardId });
  };
  const handleDelete = () => {
    executeDelete({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='h-auto w-auto p-2' variant='ghost'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='px-0 pt-3 pb-3' side='bottom' align='start'>
        <div className='text-sm font-medium text-center text-neutral-600 pb-4 select-none'>
          List actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
            variant='ghost'
          >
            <X className='h-4 w-4' />
          </Button>
        </PopoverClose>
        <PopOverButton onClick={handleAddCard}>Add card</PopOverButton>
        <PopOverButton onClick={handleCopy}>Copy list</PopOverButton>
        <Separator />
        <PopOverButton onClick={handleDelete}>Archive this list</PopOverButton>
      </PopoverContent>
    </Popover>
  );
};

const PopOverButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Button
      variant='ghost'
      className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
