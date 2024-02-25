import CategoryList from "@/components/CategoryList";
import PostList from "@/components/Posts/PostList";

export default function WritingIdeasPage() {
  return (
    <>
      <div className='flex flex-col h-full overflow-y-auto'>
        {/* Title */}
        <div className='container flex items-center justify-center py-2 gap-2 sticky top-0 bg-background z-10'>
          <div className='flex flex-col text-center'>
            <h1 className='sm:text-6xl text-4xl font-bold font-[TTHakgyoansimMulgyeolB]'>
              글
            </h1>
            <span className='text-gray-500 text-sm mt-3 font-[GmarketSansMedium]'></span>
            {/* <div className='flex flex-col justify-center text-xl p-4 space-y-2 '>
              
            </div> */}
          </div>
        </div>

        {/* category */}
        <CategoryList />

        {/* body */}
        <div className='md:mx-auto max-w-3xl'>
          <PostList />
        </div>
      </div>
    </>
  );
}
