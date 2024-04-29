import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useAuth } from "./auth/useAuth"
import { User } from "./constant/dataInterface";
import { ROLES } from "./constant/constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAdmin(user: User): boolean {
  return true;
}
