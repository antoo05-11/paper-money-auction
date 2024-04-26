"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { SessionContext, getSessionCookie, removeSessionCookie } from "@/lib/auth/session";
import { useContext } from "react";


export default function TopBar() {
    const router = useRouter();
    const pathname = usePathname();
    const routes = pathname.split('/').filter(path => path !== '');
    const listRoutes = routes.map((route, index) => '/' + routes.slice(0, index + 1).join('/'));

    // const session = useContext(SessionContext);
    const session = getSessionCookie();
    
    function logOut() {
       removeSessionCookie();
       router.push('/');
    }

    return (
        <div className="container flex justify-between items-center h-14 mb-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbSeparator />
                    {
                        listRoutes.map((route, index) => (
                            <div key={index} className="inline-flex items-center">
                                <BreadcrumbItem className="mr-2">
                                    <BreadcrumbLink href={route}>{route.split('/')[index + 1].charAt(0).toUpperCase() + route.split('/')[index + 1].slice(1) + ' '}</BreadcrumbLink>
                                </BreadcrumbItem>
                                {index != listRoutes.length - 1 && <BreadcrumbSeparator />}
                            </div>

                        ))
                    }
                </BreadcrumbList>
            </Breadcrumb>


            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {/* <Button variant="outline">Open</Button> */}
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                {!pathname.includes("/admin") && (
                    <DropdownMenuContent className="mr-3">
                        <DropdownMenuLabel>{session.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Link href={pathname.includes("me") ? "/me/profile" : "/auctioneer/profile"} className="flex flex-row">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="">
                                <Button onClick={logOut} className="flex flex-row">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                )}
            </DropdownMenu>
        </div>
    );
}