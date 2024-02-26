import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { db } from "@/lib/firebase";
import { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryButtons from "./CategoryButtons";

const CategoryList = memo(() => {
  const { data, isLoading } = useQueryCategories();

  return (
    <div
      className='hidden lg:fixed lg:top-[250px] lg:flex flex-col justify-center break-words space-y-5'
      style={{ width: "calc((100% - 768px) / 2)" }}
    >
      <div className='flex flex-col justify-center text-xl text-right border-r-4 p-4 space-y-2'>
        {isLoading ? (
          <CategoryListSkeleton />
        ) : (
          <>
            {data?.map((item) => (
              <NavLink
                key={item.id}
                to={item.id ? `/posts/${item.id}` : `/posts`}
                className={({ isActive }) =>
                  isActive ? "underline" : undefined
                }
                end
              >
                {item.name}
              </NavLink>
            ))}
          </>
        )}
      </div>

      {/* 설정 */}
      <CategoryButtons />
    </div>
  );
});

const CategoryListSkeleton = () => {
  return (
    <div className='space-y-2 mt-2 flex flex-col items-end'>
      <Skeleton className='w-full h-8 bg-neutral-200 max-w-28' />
      <Skeleton className='w-full h-8 bg-neutral-200 max-w-28' />
      <Skeleton className='w-full h-8 bg-neutral-200 max-w-28' />
    </div>
  );
};

const fetchCategories = async (setAll: boolean) => {
  const q = query(collection(db, "category"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  const categories = querySnapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      } as Category)
  );
  if (setAll) categories.unshift({ name: "ALL", id: "" });
  return categories;
};

/**
 * 카테고리 리스트 조회
 * @param setAll All option 노출 여부
 * @returns
 */
export const useQueryCategories = (setAll = true) => {
  return useQuery({
    queryKey: ["category", { setAll }],
    queryFn: () => fetchCategories(setAll),
    staleTime: 60 * 60 * 1000, // 1시간동안은 같은 쿼리 실행해도 캐시에 저장된 데이터를 갖고오도록 함.
  });
};

export default CategoryList;
