import PageForm from "@/components/Posts/form";
import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "./Post";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

interface QueryKey {
  postId: string;
}

export default function PostEditPage() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId") as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", { postId }],
    queryFn: ({ queryKey }) => fetchPost({ ...(queryKey[1] as QueryKey) }),
  });

  if (isError) {
    toast.error(error.message);
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <div className='flex flex-col h-full overflow-y-auto'>
        {/* Title */}
        <div className='container flex flex-col items-center justify-center py-2 gap-2 sticky -top-0 bg-background z-10'>
          <div className='flex flex-col text-center'>
            <h1 className='sm:text-6xl text-4xl font-bold font-[TTHakgyoansimMulgyeolB]'>
              글 수정
            </h1>
          </div>
        </div>

        {/* body */}
        <div className='md:mx-auto max-w-3xl w-full mb-3'>
          {data && <PageForm data={data} editMode />}
          {isError && (
            <h2 className='flex justify-center mt-20 text-sm font-normal m-0'>
              {error.message}
            </h2>
          )}
        </div>
      </div>
    </>
  );
}
