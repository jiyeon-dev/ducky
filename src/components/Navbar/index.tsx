import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { cn } from "@/lib/utils";
import { useScrollTop } from "@/hooks/useScrollTop";
import { ThemeToggle } from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import { NavMenu } from "./NavMenu";
import NavAvatar from "./NavAvatar";
import { Button } from "../ui/button";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const scrolled = useScrollTop();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((data: User | null) => {
      setUser(data);
    });
    return () => unsub();
  }, [user]);

  return (
    <nav
      className={cn(
        "z-50 fixed top-0 w-screen py-4 px-6 bg-background grid grid-cols-5 gap-2",
        scrolled && "border-b shadow-sm"
      )}
    >
      {/* 모바일 메뉴 */}
      <div className='md:hidden'>
        <MobileMenu />
      </div>

      {/* 로고 */}
      <Link
        to='/'
        className='flex items-center gap-x-2 shrink-0 select-none md:justify-start justify-center md:col-span-1 col-span-3'
      >
        <img
          src='/awesome_ducky.png'
          height='40'
          width='40'
          alt='logo-ducky'
          className='block'
        />
        <div className='font-semibold text-xl font-[TTHakgyoansimMulgyeolB] -ml-5 text-nowrap text-yellow-500 hidden md:block'>
          Ducky
        </div>
      </Link>

      {/* 메뉴 */}
      <NavMenu className='hidden md:flex gap-x-5 mx-auto w-full justify-center text-xl col-span-3' />

      <div className='justify-end flex items-center gap-x-2'>
        {/* 사용자 정보 */}
        {user ? (
          <NavAvatar user={user} />
        ) : (
          <Link to='/login'>
            <Button size='sm' className='break-keep	whitespace-nowrap'>
              Sign in
            </Button>
          </Link>
        )}

        {/* 테마 변경 버튼 */}
        <ThemeToggle className='hidden md:flex' />
      </div>
    </nav>
  );
}
