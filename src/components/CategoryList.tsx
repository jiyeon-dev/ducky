import { memo } from "react";
import { db } from "@/lib/firebase";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

const CategoryList = memo(() => {
  const { data, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: () => fetchCategories(),
    staleTime: 60 * 60 * 1000, // 1시간동안은 같은 쿼리 실행해도 캐시에 저장된 데이터를 갖고오도록 함.
  });

  return (
    <div
      className='hidden lg:fixed lg:top-[250px] lg:flex flex-col justify-center text-xl p-4 space-y-2 break-words text-right border-r-4'
      style={{ width: "calc((100% - 768px) / 2)" }}
    >
      <NavLink
        to=''
        className={({ isActive }) => (isActive ? "underline" : undefined)}
        end
      >
        ALL
      </NavLink>
      {isLoading ? (
        <CategoryListSkeleton />
      ) : (
        <>
          {data?.map((item) => (
            <NavLink
              key={item.id}
              to={item.id}
              className={({ isActive }) => (isActive ? "underline" : undefined)}
            >
              {item.name}
            </NavLink>
          ))}
        </>
      )}
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
  return querySnapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      } as Category)
  );
};

export default CategoryList;
