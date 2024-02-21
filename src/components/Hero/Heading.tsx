import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Heading() {
  return (
    <>
      <div className='max-w-3xl space-y-6'>
        <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
          Sharing your Ideas, Documents & Plans. Welcome to
          <p className='animate-typing overflow-hidden border-r-4 border-r-black dark:border-r-white max-w-fit mx-auto underline mb-1'>
            Ducky
          </p>
        </h1>

        <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
          Organize your knowledge on Ducky
          <br />
          and manage your projects like a boss!
        </h3>

        <Button className='font-bold'>
          Join
          <ArrowRight className='h-4 w-4 ml-2' />
        </Button>
      </div>

      <div className='flex flex-col items-center justify-center max-w-5xl'>
        <div className='flex items-center'>
          <div className='relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]'>
            <img
              src='/hero_ducky.png'
              className='object-contain'
              alt='Documents'
            />
          </div>
        </div>
      </div>
    </>
  );
}
