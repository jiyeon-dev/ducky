import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScrollTop } from "@/hooks/useScrollTop";
import { ThemeToggle } from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import { NavMenu } from "./NavMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const user = useAuth();
  const scrolled = useScrollTop();

  return (
    <nav
      className={cn(
        "z-50 fixed top-0 flex items-center w-screen py-5 px-6 justify-between",
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
        className='md:flex items-center justify-center gap-x-2 shrink-0 ml-[40px] md:ml-auto' // 아바타 크기만큼 ml
      >
        <img
          src='/ducky.svg'
          height='40'
          width='40'
          alt='logo-ducky'
          className='block'
        />
        <div className='font-semibold text-nowrap text-yellow-500 hidden md:block'>
          Ducky
        </div>
      </Link>

      {/* 메뉴 */}
      <NavMenu className='hidden md:flex gap-x-5 mx-auto w-full justify-center text-xl' />

      <div className='justify-end flex items-center gap-x-2'>
        {/* 사용자 정보 - 자리 확보를 위해 user 정보 없어도 표시하도록 함. */}
        <Avatar>
          <AvatarImage
            src={user?.photoURL || ""}
            alt={user?.displayName || ""}
          />
          {user && (
            <AvatarFallback>
              {user?.displayName?.slice(0, 2) || "AA"}
            </AvatarFallback>
          )}
        </Avatar>

        {/* 테마 변경 버튼 */}
        <ThemeToggle />
      </div>
    </nav>
  );
}
