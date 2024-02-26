import { Link, useParams } from "react-router-dom";
import { CoverImage } from "@/components/Posts/CoverImage";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Post } from "@/types";
import OwnerAvatar from "@/components/Posts/OwnerAvatar";
import { formatCreateAt } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Editor from "@/components/Posts/Editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DeleteModal } from "@/components/Posts/DeleteModal";

interface QueryKey {
  postId: string;
}

export default function PostPage() {
  const { postId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", { postId }],
    queryFn: ({ queryKey }) => fetchPost({ ...(queryKey[1] as QueryKey) }),
  });

  if (isError) {
    toast.error(error.message, { id: postId });
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {data && postId && (
        <div className='flex flex-col h-full overflow-y-auto'>
          {/* image */}
          <div className='flex flex-col text-center w-full'>
            <CoverImage preview url={data?.mainImageUrl} />
          </div>

          <div className='md:mx-auto max-w-3xl w-full my-4'>
            <div className='container h-full flex flex-col overflow-x-hidden relative space-y-4 mb-4 w-full'>
              <h2 className='capitalize font-semibold'>{data?.categoryId}</h2>

              <h1 className='text-3xl sm:text-4xl font-bold break-words'>
                {data?.title}
              </h1>
              <h3 className='text-gray-600 break-words'>{data?.description}</h3>
              <div className='flex flex-row items-center space-x-2'>
                <OwnerAvatar owner={data?.owner} />
                <Separator orientation='vertical' />
                <div className=''>{formatCreateAt(data?.createdAt)}</div>
              </div>

              <hr />

              <Editor editable={false} initialContent={data?.content} />

              <hr />

              <div className='flex space-x-2 justify-center'>
                <Link to={".."}>
                  <Button variant='ghost'>Back</Button>
                </Link>
                <Button>Edit</Button>
                <DeleteModal postId={postId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const fetchPost = async ({ postId }: QueryKey): Promise<Post> => {
  try {
    if (!postId) return {} as Post;
    const docRef = doc(db, "posts", postId);
    const docSnapshot = await getDoc(docRef);

    return {
      ...docSnapshot.data(),
      id: docSnapshot.id,
    } as Post;
  } catch (error) {
    throw new Error("Error fetching Firestore data: " + error);
  }
};
