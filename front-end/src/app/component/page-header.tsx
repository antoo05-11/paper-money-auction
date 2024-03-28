"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function PageHeader() {
  const [navBar, setNavbar] = useState(false);
  const changeBackground = () => {
    if (window.scrollY >= 100) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <div
      className={`h-14 fixed w-screen z-10 flex items-center transition-all duration-300 ${
        navBar ? "bg-white" : "bg-transparent"
      }`}
    >
      <div className="container">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button asChild>
                <Link href={"/"}>Trang chủ</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Input placeholder="Tìm kiếm" />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild>
                <Link href={"/login"}>Đăng nhập</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
