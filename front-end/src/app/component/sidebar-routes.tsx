"use client";

import { Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
]

const adminRoutes = [
    {
        icon: List,
        label: "Customer",
        href:"/admin/customer",
    },
    {
        icon: List,
        label: "Staff",
        href:"/admin/staff",
    },
]

export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isAdminPage = pathname?.includes("/admin");

    const routes = isAdminPage ? adminRoutes : guestRoutes;

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