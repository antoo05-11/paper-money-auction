import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { User } from "./constant/dataInterface";
import { getCookies } from "next-client-cookies/server";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serverRole(): any {
  const cookies = getCookies();
  const user = JSON.parse(cookies.get('user') ?? '');
  return user?.role;
}