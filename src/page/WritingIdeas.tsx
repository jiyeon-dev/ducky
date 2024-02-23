export default function WritingIdeasPage() {
  return (
    <>
      <div className='flex flex-col h-full'>
        {/* Title */}
        <div className='container flex items-center justify-center py-2 gap-2'>
          <div className='flex flex-col text-center'>
            <h1 className='sm:text-6xl text-4xl font-bold font-[TTHakgyoansimMulgyeolB]'>
              글감
            </h1>
            {/* <span className='text-gray-500 text-sm mt-3 font-[GmarketSansMedium]'>
              고무오리 멤버라면 누구나 쓰고 수정할 수 있습니다.
            </span> */}
          </div>
        </div>

        {/* body */}
        <div className='p-4 h-full overflow-x-auto'>
          {/* {isLoading && <LoadingSpinner />}
          {!isLoading && <Kanban data={lists} boardId='ducky' />} */}
        </div>
      </div>
    </>
  );
}
