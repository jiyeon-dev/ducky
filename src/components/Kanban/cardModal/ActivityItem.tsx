import { format } from "date-fns";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ActivityLog } from "@/types";

interface ActivityItemProps {
  data: ActivityLog;
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
  return (
    <li className='flex items-start gap-x-2'>
      <Avatar className='h-8 w-8'>
        <AvatarImage src='/hero_ducky.png' />
      </Avatar>
      <div className='flex flex-col space-y-0.5'>
        <p className='text-sm text-muted-foreground'>
          <span className='font-semibold lowercase text-[var(--kanban-text)]'>
            이름
          </span>
          <span className='text-xs text-muted-foreground ml-2'>
            {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </p>
        <p className='text-sm text-[var(--kanban-text)] bg-[var(--kanban-bg)] rounded-md px-3 py-2'>
          로그 메세지
        </p>
      </div>
    </li>
  );
};
