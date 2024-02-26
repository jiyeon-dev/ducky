import { Owner } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OwnerAvatar({ owner }: { owner?: Owner }) {
  return (
    <div className='flex items-center space-x-2'>
      <Avatar className='h-8 w-8 border'>
        <AvatarImage src={owner?.photoURL || ""} alt='avatar' />
        <AvatarFallback>익명</AvatarFallback>
      </Avatar>
      <span>{owner?.displayName || ""}</span>
    </div>
  );
}
