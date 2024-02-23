import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { FormTextarea } from "../form/formTextarea";
import { FormSubmit } from "../form/formSubmit";

export default function ActivityCommentInput() {
  const user = useAuth();
  // TODO: actions

  return (
    <li className='flex items-start gap-x-2 md:mr-0 mr-4'>
      <Avatar className='h-8 w-8'>
        {/* 로그인 유저 이미지 */}
        <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
        <AvatarFallback className='bg-yellow-400 text-sm'>
          {user?.displayName || ""}
        </AvatarFallback>
      </Avatar>
      <div className='flex flex-col space-y-0.5 flex-1 mr-4 break-words'>
        <form className='space-y-2'>
          <FormTextarea
            id='description'
            className='w-full text-[var(--kanban-text)] bg-[var(--kanban-bg)] border-transparent'
            placeholder='Write a comment...'
            defaultValue=''
            // errors={fieldErrors}
          />
          <div className='flex items-center gap-x-2'>
            <FormSubmit disabled={true}>Save</FormSubmit>
          </div>
        </form>
      </div>
    </li>
  );
}
