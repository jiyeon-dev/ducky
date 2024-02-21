import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

import { Button } from "@/components/ui/button";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  return (
    <Button variant='ghost' className={className} onClick={handleClick}>
      <Sun className='h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0' />
    </Button>
  );
};
