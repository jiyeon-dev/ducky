import PageForm from "@/components/Posts/form";

export default function PostEditPage() {
  return (
    <>
      <div className='flex flex-col h-full overflow-y-auto'>
        {/* Title */}
        <div className='container flex flex-col items-center justify-center py-2 gap-2 sticky -top-0 bg-background z-10'>
          <div className='flex flex-col text-center'>
            <h1 className='sm:text-6xl text-4xl font-bold font-[TTHakgyoansimMulgyeolB]'>
              새 글
            </h1>
          </div>
        </div>

        {/* body */}
        <div className='md:mx-auto max-w-3xl w-full mb-3'>
          <PageForm />
        </div>
      </div>
    </>
  );
}
