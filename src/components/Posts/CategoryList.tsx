import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { db } from "@/lib/firebase";
import { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
                to={item.id}
                className={({ isActive }) =>
                  isActive ? "underline" : undefined
                }
              >
                {item.name}
              </NavLink>
            ))}
          </>
        )}
      </div>

      {/* 설정 */}
      <div className='text-right'>
        <Button variant='secondary' size='sm'>
          글쓰기
        </Button>
      </div>
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

const fetchCategories = async () => {
  const q = query(collection(db, "category"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  const categories = querySnapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      } as Category)
  );
  categories.unshift({ name: "ALL", id: "" });
  return categories;
};

export const useQueryCategories = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: () => fetchCategories(),
    staleTime: 60 * 60 * 1000, // 1시간동안은 같은 쿼리 실행해도 캐시에 저장된 데이터를 갖고오도록 함.
  });
};

export default CategoryList;
