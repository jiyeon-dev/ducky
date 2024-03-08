import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const thisYear = new Date().getFullYear();

  return (
    <div className='md:grid md:grid-cols-3 flex justify-center w-full p-6 bg-background z-50'>
      <div className='hidden md:flex items-center'>
        <Link to='https://github.com/jiyeon-dev/ducky'>
          <Button variant='ghost' size='icon'>
            <Github />
          </Button>
        </Link>
      </div>
      <div className='text-center text-muted-foreground flex items-center justify-center'>
        <span>ⓒ {thisYear}</span>
      </div>
      <div className='hidden md:flex items-center'></div>
    </div>
  );
}
