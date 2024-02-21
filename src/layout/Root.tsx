import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className='h-full'>
      <Navbar />
      <main className='h-full pt-20'>
        <Outlet />
      </main>
    </div>
  );
}
