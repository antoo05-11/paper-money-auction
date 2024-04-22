import { BadgeDollarSign, Bell, Compass, FileClock, LandPlot, Layout, List, ScrollText } from "lucide-react";

export const adminRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/admin",
    },
    {
        icon: List,
        label: "Customer",
        href: "/admin/customer",
    },
    {
        icon: List,
        label: "Staff",
        href: "/admin/staff",
    },
]

export const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
]

export const userRoutes = [

    {
        icon: LandPlot,
        label: "Đăng ký tài sản đấu giá",
        href: "/me"
    },
    {
        icon: FileClock,
        label: "Lịch sử đấu giá",
        href: "/me/history"
    },
    {
        icon: BadgeDollarSign,
        label: "Phiên đấu giá của tôi",
        href: "/me/auction"
    },
    {
        icon: ScrollText,
        label: "Tài liệu của tôi",
        href: "/me/document"
    },
]

export const auctioneerRoutes = [
    {
        icon: Layout,
        label: "Phiên đấu giá",
        href: "/auctioneer",
    },

]

