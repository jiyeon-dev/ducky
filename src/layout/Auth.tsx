import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { logout } from "@/actions/auth/logout";
import { Card } from "@/components/ui/card";

export default function AuthLayout() {
  useEffect(() => {
    // 강제 로그아웃
    logout();
  }, []);

  return (
    <>
      <main className='h-screen overflow-y-auto'>
        <div className='grid place-content-center h-screen font-[GmarketSansMedium]'>
          <img
            src='/login.png'
            className='sm:w-96 w-screen mx-auto -mb-8 z-10 select-none'
          />
          <Card className='sm:w-96 w-screen border-0  sm:border'>
            {/* body */}
            <Outlet />
          </Card>
        </div>
      </main>

      <Toaster richColors position='top-center' />
    </>
  );
}
