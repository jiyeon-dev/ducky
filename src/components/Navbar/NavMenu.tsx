import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface NavMenuProps {
  className: string;
  setOpen?: (open: boolean) => void;
}

/**
 * 모바일 / 웹 공통 네비게이션
 */
export const NavMenu = ({ className, setOpen }: NavMenuProps) => {
  const handleClose = () => {
    if (setOpen) setOpen(false);
  };

  return (
    <div className={cn("", className)}>
      <NavLink
        to='/'
        className={({ isActive }) => (isActive ? "underline" : undefined)}
        onClick={handleClose}
        end
      >
        <NavMenuTitle>Home</NavMenuTitle>
      </NavLink>
      <NavLink
        to='/writing_ideas'
        className={({ isActive }) => (isActive ? "underline" : undefined)}
        onClick={handleClose}
      >
        <NavMenuTitle>Writing Ideas</NavMenuTitle>
      </NavLink>
      <NavLink
        to='storage'
        className={({ isActive }) => (isActive ? "underline" : undefined)}
        onClick={handleClose}
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
