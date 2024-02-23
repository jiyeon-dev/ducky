import { Skeleton } from "@/components/ui/skeleton";
import { ActivityIcon } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { ActivityLog, Comment } from "@/types";
import ActivityCommentInput from "./ActiviyCommentInput";

interface ActivityProps {
  items: ActivityLog[];
  comments: Comment[];
}

export const Activity = ({ items, comments }: ActivityProps) => {
  const logs = [...items, ...comments];
  logs.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  return (
    <div className='flex items-start gap-x-3 w-full'>
      <ActivityIcon className='h-5 w-5 mt-0.5 text-[var(--kanban-text)]' />
      <div className='w-full'>
        <p className='font-semibold mb-2 text-[var(--kanban-text)]'>Activity</p>
        <ol className='mt-2 space-y-4'>
          {/* 댓글 입력 */}
          <ActivityCommentInput />

          {logs.map((item, index) => (
            <ActivityItem key={`${item.id}-${index}`} data={item} />
          ))}
        </ol>
      </div>
    </div>
  );
};

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className='flex items-start gap-x-3 w-full'>
      <Skeleton className='h-6 w-6 bg-neutral-200' />
      <div className='w-full'>
        <Skeleton className='w-24 h-6 mb-2 bg-neutral-200' />
        <Skeleton className='w-full h-10 bg-neutral-200' />
      </div>
    </div>
  );
};
