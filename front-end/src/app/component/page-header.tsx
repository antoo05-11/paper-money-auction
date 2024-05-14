"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import Link from "next/link";
import { useAuth } from "@/lib/auth/useAuth";
import UserMenu from "@/components/_layout/user-menu";
import { Logo } from "@/components/_layout/logo";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/_layout/mode-toggle";

export default function PageHeader() {
  const [navBar, setNavbar] = useState(false);
  const auth = useAuth();

  const pathName = usePathname();

  const changeBackground = () => {
    if (!pathName.includes("item")) {
      if (window.scrollY >= 100) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }
    }
  };

  useEffect(() => {
    if (pathName.includes("item")) {
      setNavbar(true);
    }
  }, [pathName]);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";
  return (
    <header
      className={`min-h-[70px] fixed w-screen z-50 flex items-center transition-all duration-300 ${
        navBar ? "bg-card shadow" : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex justify-between gap-4">
          <ModeToggle />
          <div className="flex items-center gap-3">
          </div>
          <div className="flex flex-row">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} ${
                        navBar ? "text-black dark:text-white" : "text-white"
                      }`}
                    >
                      Trang chủ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/item" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} ${
                        navBar ? "text-black dark:text-white" : "text-white"
                      }`}
                    >
                      Cuộc đấu giá
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} ${
                        navBar ? "text-black dark:text-white" : "text-white"
                      }`}
                    >
                      Liên hệ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex ml-32">
              <div className="flex items-center gap-3">
                {auth?.user ? (
                  <UserMenu />
                ) : (
                  <Link href={"/login/signin"}>
                    <Button className="shadow-lg">
                      Đăng nhập
                      <ArrowRight size={18} className="ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
