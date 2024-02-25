import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

interface RootLayoutProps {
  outlet?: React.ReactElement | null;
}

export default function RootLayout({ outlet }: RootLayoutProps) {
  return (
    <>
      <div className='h-full'>
        <Navbar />
        <main className='h-full pt-20'>
          {outlet}
          {<Outlet />}
        </main>
      </div>

      <Toaster richColors />
    </>
  );
}
