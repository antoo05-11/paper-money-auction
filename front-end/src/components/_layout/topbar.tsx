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
import { usePathname } from "next/navigation";

export default function TopBar() {
    const pathname = usePathname();
    const routes = pathname.split('/').filter(path => path !== '');
    const listRoutes = routes.map((route, index) => '/' + routes.slice(0, index + 1).join('/'));
    
    
    return (
        <div className="container flex justify-between items-center h-14 mb-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbSeparator />
                    {
                        listRoutes.map((route, index) => (
                            <div key={index} className="inline-flex items-center">
                                <BreadcrumbItem className="mr-2">
                                    <BreadcrumbLink href={route}>{route.split('/')[index+1].charAt(0).toUpperCase() + route.split('/')[index+1].slice(1) + ' '}</BreadcrumbLink>
                                </BreadcrumbItem>
                                {index != listRoutes.length - 1 && <BreadcrumbSeparator />}
                            </div>

                        ))
                    }
                </BreadcrumbList>
            </Breadcrumb>

            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    );
}