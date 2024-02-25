import PostListItem from "./PostListItem";

export default function PostList() {
  return (
    <div className='container h-full flex flex-col overflow-x-hidden relative space-y-4 mb-4'>
      {/* <PostListItem.Skeleton /> */}
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
    </div>
  );
}
