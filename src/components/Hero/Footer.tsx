import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function Footer() {
  const thisYear = new Date().getFullYear();

  return (
    <div className='flex items-center w-full p-6 bg-background z-50'>
      <div className='hidden md:flex items-center'>
        <Button variant='ghost' size='sm'>
          <Github />
        </Button>
      </div>
      <div className='w-full text-center text-muted-foreground absolute left-0'>
        <span>ⓒ {thisYear}</span>
      </div>
      <div className='hidden md:flex items-center'></div>
    </div>
  );
}
