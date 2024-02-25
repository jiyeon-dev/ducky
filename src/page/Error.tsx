import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: unknown = useRouteError();

  return (
    <div className='flex items-center justify-center h-full'>
      <h1
        className='inline-block mr-5 pr-5 text-2xl font-bold'
        style={{ borderRight: "1px solid" }}
      >
        {(error as { status?: number })?.status}
      </h1>

      <div className='inline-block'>
        <h2 className='text-sm font-normal m-0'>
          {(error as Error)?.message ||
            (error as { statusText?: string })?.statusText}
        </h2>
      </div>
    </div>
  );
}
