"use client"

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
} from "@/components/ui/navigation-menu"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        window.addEventListener('scroll', changeBackground);
        return () => {
            window.removeEventListener('scroll', changeBackground);
        }
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
        )
    })
    ListItem.displayName = "ListItem"
    return (
        <header className={`min-h-[70px] fixed w-screen z-10 flex items-center transition-all duration-300 ${navBar ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="container">
                <div className='flex flex-wrap items-center gap-4'>
                    <div className='flex ml-auto lg:order-1'>
                        <Link href={"/login"}>
                            <Button className="mt-2 bg-highlightColor">Đăng nhập</Button>
                        </Link>
                    </div>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Trang chủ
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Cuộc đấu giá</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="gap-3 p-5 md:w-[300px] lg:w-[300px] lg:grid-cols-[.75fr_1fr]">
                                        <ListItem href="/docs/installation" title="Cuộc đáu giá sắp diễn ra" className={navigationMenuTriggerStyle()}></ListItem>
                                        <ListItem href="/docs/primitives/typography" title="Cuộc đấu giá đang diễn ra" className={navigationMenuTriggerStyle()}></ListItem>
                                        <ListItem href="/docs/primitives/typography" title="Cuộc đấu giá đã diễn" className={navigationMenuTriggerStyle()}></ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Liên hệ
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header>
    );
}