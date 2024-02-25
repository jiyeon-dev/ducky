import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function PostListItem() {
  return (
    <Card className='flex flex-col sm:flex-row space-y-4 sm:space-x-4 cursor-pointer p-4'>
      {/* image */}
      <div
        className='bg-center bg-no-repeat bg-contain rounded-lg shrink-0 h-[200px] sm:h-[150px] w-full sm:w-[150px]'
        style={{ backgroundImage: "url(/hero_ducky.png)" }}
      ></div>

      <div className='flex flex-col w-full sm:w-screen space-y-2 sm:space-y-1'>
        {/* category */}
        <span className='text-gray-500 font-bold'>Javascript</span>

        {/* title */}
        <h1 className='text-2xl font-bold line-clamp-2'>
          타이틀타이틀타이틀타이틀타이틀 타이틀 타이틀타이틀타이틀타이틀타이틀
          타이틀
        </h1>

        {/* description */}
        <span className='text-gray-500 text-sm mt-3 line-clamp-1'>
          descriptiondescriptiondescription description description
          descriptiondescription descriptiondescriptiondescription description
          description description description description description
        </span>

        {/* tags */}
        <div className='space-x-1'>
          <Badge className='bg-yellow-500'>Badge</Badge>
          <Badge className='bg-yellow-500'>Badge</Badge>
          <Badge className='bg-yellow-500'>Badge</Badge>
          <Badge className='bg-yellow-500'>Badge</Badge>
          <Badge className='bg-yellow-500'>Badge</Badge>
          <Badge className='bg-yellow-500'>Badge</Badge>
          <Badge className='bg-yellow-500'>Badge</Badge>
          <Badge className='bg-yellow-500'>Badge</Badge>
          <Badge className='bg-yellow-500'>Badge</Badge>
        </div>

        {/* writer */}
        <div className='flex items-center space-x-2'>
          <Avatar className='h-8 w-8 border'>
            <AvatarImage
              src='https://firebasestorage.googleapis.com/v0/b/react-ducky.appspot.com/o/avatar%2Favatar_king.png?alt=media&token=ae857479-a250-4eed-839d-e4b933c49de0'
              alt='avatar'
            />
            <AvatarFallback>익명</AvatarFallback>
          </Avatar>
          <span className='text-gray-700'>거위</span>
        </div>
      </div>
    </Card>
  );
}

PostListItem.Skeleton = function PostListItemSkeleton() {
  return (
    <Card className='flex flex-col sm:flex-row space-y-4 sm:space-x-4 p-4'>
      <Skeleton className='bg-neutral-200 shrink-0 h-[200px] sm:h-[150px] w-full sm:w-[150px]' />
      <div className='flex flex-col space-y-1 w-full'>
        <Skeleton className='w-full h-6 mb-2 bg-neutral-200' />
        <Skeleton className='w-full h-10 bg-neutral-200' />
      </div>
    </Card>
  );
};
