import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <>
      <div className='h-full'>
        <Navbar />
        <main className='h-full pt-20'>
          <Outlet />
        </main>
      </div>

      <Toaster richColors />
    </>
  );
}
