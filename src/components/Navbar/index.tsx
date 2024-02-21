import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScrollTop } from "@/hooks/useScrollTop";
import { ThemeToggle } from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import { NavMenu } from "./NavMenu";

export default function Navbar() {
  const scrolled = useScrollTop();

  return (
    <nav
      className={cn(
        "z-50 fixed bg-background first-line:top-0 flex items-center w-full py-5 px-6 justify-between",
        scrolled && "border-b shadow-sm"
      )}
    >
      {/* 모바일 메뉴 */}
      <div className='md:hidden'>
        <MobileMenu />
      </div>

      {/* 로고 */}
      <Link to='/' className='md:flex mx-auto items-center gap-x-2'>
        <img src='/ducky.svg' height='40' width='40' alt='logo-ducky' />
        <p className='font-semibold text-nowrap text-yellow-500 hidden md:block'>
          Ducky
        </p>
      </Link>

      {/* 메뉴 */}
      <NavMenu className='hidden md:flex gap-x-5 mx-auto w-full justify-center text-xl' />

      {/* 테마 변경 버튼 */}
      <div className='justify-end flex items-center gap-x-2'>
        <ThemeToggle />
      </div>
    </nav>
  );
}
