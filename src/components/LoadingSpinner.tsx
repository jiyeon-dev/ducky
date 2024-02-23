import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

export interface LoadingSpinnerProps
  extends React.InputHTMLAttributes<HTMLImageElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 140,
  className,
  ...props
}: LoadingSpinnerProps) => {
  return createPortal(
    <div className='fixed top-0 z-50 flex flex-col justify-center w-screen h-screen items-center bg-black/80'>
      <img
        src='/spinner_ducky.png'
        width={size}
        height={size}
        className={cn(
          `h-[${size}px] motion-safe:animate-bounce select-none`,
          className
        )}
        {...props}
      />
      {/* <div className='text-2xl'>waiting...</div> */}
    </div>,
    document.getElementById("ducky-loadingSpinner")!
  );
};
