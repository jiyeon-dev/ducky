import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ActivityLog, Comment } from "@/types";
import { formatCreateAt } from "@/lib/utils";

interface ActivityItemProps {
  data: ActivityLog | Comment;
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
  let createdAt;
  const timestamp = data.createdAt;
  if (timestamp) {
    createdAt = formatCreateAt(timestamp);
  }

  return (
    <li className='flex items-start gap-x-2'>
      <Avatar className='h-8 w-8'>
        <AvatarImage
          src={data.user?.photoURL || ""}
          alt={data.user?.displayName || ""}
        />
        <AvatarFallback>익명</AvatarFallback>
      </Avatar>
      <div className='flex flex-col space-y-0.5'>
        <p className='text-sm text-muted-foreground'>
          <span className='font-semibold lowercase text-[var(--kanban-text)]'>
            {data.user?.displayName}
          </span>
          <span className='text-xs text-muted-foreground ml-2'>
            {createdAt}
          </span>
        </p>
        <p className='text-sm text-[var(--kanban-text)] bg-[var(--kanban-bg)] rounded-md px-3 py-2'>
          {"memo" in data ? data.memo : "message" in data ? data.message : ""}
        </p>
      </div>
    </li>
  );
};
