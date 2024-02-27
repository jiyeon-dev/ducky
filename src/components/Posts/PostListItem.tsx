import { Post } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function PostListItem({ data }: { data: Post }) {
  const navigate = useNavigate();
  const handleClickCard = () => {
    navigate(`/posts/${data.id}`);
  };

  return (
    <Card
      className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 cursor-pointer p-4'
      onClick={handleClickCard}
    >
      {/* image */}
      <div
        className='bg-center bg-no-repeat bg-cover rounded-lg shrink-0 h-[200px] sm:h-[150px] sm:w-[150px]'
        style={{
          backgroundImage: `url(${data.mainImageUrl || "/no-image.jpeg"})`,
        }}
      ></div>

      <div className='flex flex-col w-full sm:w-screen space-y-2 sm:space-y-1'>
        {/* category */}
        <span className='text-gray-500 font-bold capitalize'>
          {data.categoryId}
        </span>

        {/* title */}
        <h1 className='text-2xl font-bold line-clamp-2'>{data.title}</h1>

        {/* description */}
        <span className='text-gray-500 text-sm mt-3 line-clamp-1'>
          {data.description}
        </span>

        {/* tags */}
        <div className='space-x-1'>
          {data.tags?.map((tag, index) => (
            <Badge key={index} className='bg-yellow-500'>
              {tag}
            </Badge>
          ))}
        </div>

        {/* writer */}
        <div className='flex items-center space-x-2'>
          <Avatar className='h-8 w-8 border'>
            <AvatarImage src={data.owner?.photoURL || ""} alt='avatar' />
            <AvatarFallback>익명</AvatarFallback>
          </Avatar>
          <span className='text-gray-700'>{data.owner?.displayName || ""}</span>
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
