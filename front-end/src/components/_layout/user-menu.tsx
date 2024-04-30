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
import { useAuth } from "@/lib/auth/useAuth";
import { ROLES } from "@/lib/constant/constant";

export default function UserMenu() {
    const router = useRouter();
    const pathname = usePathname();
    const routes = pathname.split('/').filter(path => path !== '');
    const listRoutes = routes.map((route, index) => '/' + routes.slice(0, index + 1).join('/'));

    const auth = useAuth();

    const isAdmin = auth?.user?.role == ROLES.ADMIN;
    
    function logOut() {
       auth.logout();
       router.push('/');
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {/* <Button variant="outline">Open</Button> */}
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-3">
                        <DropdownMenuLabel>{auth.user?.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {!isAdmin && (
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                <Link href={'/me'} className="flex flex-row">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Me</span>
                                </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={pathname.includes("me") ? "/me/profile" : "/auctioneer/profile"} className="flex flex-row">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                </DropdownMenuGroup>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="">
                                <Button onClick={logOut} className="flex flex-row">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}