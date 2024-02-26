import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/actions/post/deletePost";
import { useAction } from "@/hooks/useAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "../LoadingSpinner";

export function DeleteModal({ postId }: { postId: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { execute, isLoading } = useAction(deletePost, {
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.removeQueries({ queryKey: ["posts"] });
      setOpen(false);
      navigate("/posts");
    },
    onError: (error) => {
      toast.error(error);
      setOpen(false);
    },
  });

  const handleSubmit = () => {
    if (!postId) {
      toast.error("Cannot found post id!");
      return;
    }

    execute({ id: postId });
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='destructive'>Delete</Button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle className='flex items-center justify-center text-red-500'>
              <AlertCircle className='mr-2' /> Delete
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-col space-y-2'>
            <p className='text-xl font-semibold text-center'>
              Are you sure you want to delete?
            </p>
            <p className='text-center text-gray-600'>
              Deleted posts cannot be recovered.
            </p>
          </div>

          <DialogFooter className='flex flex-row'>
            <DialogClose asChild>
              <Button type='button' variant='ghost' className='flex-grow'>
                Close
              </Button>
            </DialogClose>
            <Button
              type='submit'
              variant='destructive'
              className='flex-grow'
              onClick={handleSubmit}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
