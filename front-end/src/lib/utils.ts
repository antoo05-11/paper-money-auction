import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "./constant/dataInterface";
import { getCookies } from "next-client-cookies/server";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serverRole(): any {
  const cookies = getCookies();
  const userInCookies = cookies.get("user");
  if (userInCookies) {
    const user = JSON?.parse(userInCookies);
    return user.role;
  }
  return null;
}

export function removeCookie(): any {
  const cookies = getCookies();
  cookies.remove("user");
}
