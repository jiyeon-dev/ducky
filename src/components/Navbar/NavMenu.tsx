import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

/**
 * 모바일 / 웹 공통 네비게이션
 */
export const NavMenu = ({ className }: { className: string }) => {
  return (
    <div className={cn("", className)}>
      <NavLink
        to='/'
        className={({ isActive }) => (isActive ? "underline" : undefined)}
        end
      >
        <NavMenuTitle>Home</NavMenuTitle>
      </NavLink>
      <NavLink
        to='/'
        className={({ isActive }) => (isActive ? "underline" : undefined)}
      >
        <NavMenuTitle>Writing Ideas</NavMenuTitle>
      </NavLink>
      <NavLink
        to='storage'
        className={({ isActive }) => (isActive ? "underline" : undefined)}
      >
        <NavMenuTitle>Storage</NavMenuTitle>
      </NavLink>
    </div>
  );
};

const NavMenuTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className='font-bold m-2 hover:underline capitalize'>{children}</h1>
  );
};
