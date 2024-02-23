import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { Trash } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { useAction } from "@/hooks/useAction";
import { deleteCard } from "@/actions/kanban/deleteCard";
import { toast } from "sonner";
import { useCardModal } from "@/hooks/useCardModal";
import { useQueryClient } from "@tanstack/react-query";

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const cardModal = useCardModal();
  const queryClient = useQueryClient();

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" deleted`);
        queryClient.invalidateQueries({
          queryKey: ["storage"],
        });
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onDelete = () => {
    executeDeleteCard({
      id: data.id,
      listId: data.listId,
    });
  };

  return (
    <div className='space-y-2 mt-2 select-none'>
      <p className='text-xs font-semibold'>Actions</p>
      <ActionButton
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant='destructive'
      >
        <Trash className='h-4 w-4 mr-2' />
        Delete
      </ActionButton>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className='space-y-2 mt-2'>
      <Skeleton className='w-20 h-4 bg-neutral-200' />
      <Skeleton className='w-full h-8 bg-neutral-200' />
      <Skeleton className='w-full h-8 bg-neutral-200' />
    </div>
  );
};
