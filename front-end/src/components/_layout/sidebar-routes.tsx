"use client";

import { adminRoutes, guestRoutes, userRoutes, auctioneerRoutes } from "@/lib/constant/routes";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isAdminPage = pathname?.includes("/admin");
    const isUserPage = pathname?.includes("/me");
    const isAuctioneerPage = pathname?.includes("/auctioneer");

    const routes = isAdminPage ? adminRoutes : (isUserPage ? userRoutes : (isAuctioneerPage ? auctioneerRoutes : guestRoutes));


    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}