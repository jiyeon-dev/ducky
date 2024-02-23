import { format } from "date-fns";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ActivityLog } from "@/types";

interface ActivityItemProps {
  data: ActivityLog;
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
  let createdAt;
  const timestamp = data.createdAt;
  if (timestamp) {
    const date = new Date(timestamp.seconds * 1000);
    createdAt = format(date, "MMM d, yyyy 'at' h:mm a");
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
          {data.memo}
        </p>
      </div>
    </li>
  );
};
