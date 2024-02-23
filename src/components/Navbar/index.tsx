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
        "z-50 fixed top-0 flex items-center w-screen py-4 px-6 justify-between bg-background",
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
        className='md:flex items-center justify-center gap-x-2 shrink-0 select-none ml-[40px] md:ml-auto' // 아바타 크기만큼 ml
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
      <NavMenu className='hidden md:flex gap-x-5 mx-auto w-full justify-center text-xl' />

      <div className='justify-end flex items-center gap-x-2'>
        {/* 사용자 정보 */}
        <NavAvatar user={user} />

        {/* 테마 변경 버튼 */}
        <ThemeToggle />
      </div>
    </nav>
  );
}
