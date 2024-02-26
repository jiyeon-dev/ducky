import { useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  DocumentData,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import PostListItem from "./PostListItem";
import { LoadingSpinner } from "../LoadingSpinner";

export default function PostList() {
  const target = useRef<HTMLDivElement>(null);
  const { categoryId } = useParams();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    initialPageParam: undefined,
    queryKey: ["posts", { category: categoryId }],
    queryFn: async ({ pageParam }) => {
      const querySnapshot = await getPostList(
        pageParam || undefined,
        categoryId
      );
      return querySnapshot;
    },
    getNextPageParam: (querySnapshot) => {
      if (!querySnapshot?.docs) return undefined;
      const lastPageParam = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (querySnapshot.size < 6) {
        return undefined;
      }
      return lastPageParam;
    },
  });

  if (isError) {
    toast.error(error.message, { id: "post-list" });
  }

  useIntersectionObserver({
    root: null,
    target: target,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <div className='container h-full flex flex-col overflow-x-hidden relative space-y-4 mb-4 w-full'>
      {(isLoading || isFetchingNextPage) && <LoadingSpinner />}
      {data?.pages?.[0].docs.length === 0 && (
        <div className='flex justify-center text-2xl text-gray-400 font-bold mt-10'>
          nothing...
        </div>
      )}
      {data?.pages.map((snapshot) => {
        return snapshot.docs.map((doc: { id: string; data: () => Post }) => (
          <PostListItem key={doc.id} data={{ ...doc.data(), id: doc.id }} />
        ));
      })}
      <div ref={target} />
    </div>
  );
}

const getPostList = async (
  pageParam: undefined,
  id: string | undefined
): Promise<DocumentData> => {
  const conditions = [];
  if (id) conditions.push(where("categoryId", "==", id));
  if (pageParam) conditions.push(startAfter(pageParam));

  const q = query(
    collection(db, "posts"),
    ...conditions,
    orderBy("createdAt", "desc"),
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot;
};
