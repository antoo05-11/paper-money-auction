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
import { ArrowRight } from 'lucide-react';

import Link from "next/link";
import { useAuth } from "@/lib/auth/useAuth";
import UserMenu from "@/components/_layout/user-menu";
import { Logo } from "@/components/_layout/logo";
import { usePathname } from "next/navigation";

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
      setNavbar(true)
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
      className={`min-h-[70px] fixed w-screen z-50 flex items-center transition-all duration-300 ${navBar ? "bg-white shadow-md" : "bg-transparent"
        }`}
    >
      <div className="container">
        <div className="flex justify-between gap-4">
          <div>
            <Logo />
          </div>
          <div className="flex flex-row">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${navBar ? 'text-black' : 'text-white'}`}>
                      Trang chủ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} ${navBar ? 'text-black' : 'text-white'}`}>Cuộc đấu giá</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="gap-3 p-5 md:w-[300px] lg:w-[300px] lg:grid-cols-[.75fr_1fr]">
                      <ListItem
                        href="/item"
                        title="Cuộc đáu giá sắp diễn ra"
                        className="hover:text-highlightColor"
                      ></ListItem>
                      <ListItem
                        href="/item"
                        title="Cuộc đấu giá đang diễn ra"
                        className="hover:text-highlightColor"
                      ></ListItem>
                      <ListItem
                        href="/item"
                        title="Cuộc đấu giá đã diễn"
                        className="hover:text-highlightColor"
                      ></ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${navBar ? 'text-black' : 'text-white'}`}>
                      Liên hệ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex ml-32">
              <div className="flex items-center">
                {auth?.user ?
                  <UserMenu /> :
                  <Link href={"/login/signin"}>
                    <Button className="bg-highlightColor">
                      Đăng nhập
                      <ArrowRight size={18} className="ml-1" />
                    </Button>
                  </Link>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
