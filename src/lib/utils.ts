import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { TimeStamp } from "@/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 모바일 검증
 * @returns {boolean} 모바일 여부
 */
export const checkIsMobile = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return isMobile;
};

/**
 * firebase serverTimestamp() 값 변환
 * @param timestamp
 * @param formatStr
 * @returns
 */
export const formatCreateAt = (
  timestamp: TimeStamp | undefined | null,
  formatStr = "MMM d, yyyy 'at' h:mm a"
) => {
  if (!timestamp) return "Format Error";
  const date = new Date(timestamp.seconds * 1000);
  return format(date, formatStr);
};
