import {
  BadgeDollarSign,
  BookUser,
  FileClock,
  FileCode2Icon,
  LandPlot,
  Layout,
  SquareDashedMousePointer,
  SquareGanttChartIcon,
  UsersRound,
} from "lucide-react";

export const adminRoutes = [
  {
    icon: Layout,
    label: "Trang chủ",
    href: "/admin",
  },
  {
    icon: SquareGanttChartIcon,
    label: "Người dùng",
    href: "/admin/customer",
  },
  {
    icon: UsersRound,
    label: "Nhân viên",
    href: "/admin/staff",
  },
  {
    icon: FileCode2Icon,
    label: "Tài sản",
    href: "/admin/asset",
  }
];

export const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
];

export const userRoutes = [
  {
    icon: BookUser,
    label: "Thông tin cá nhân",
    href: "/me",
  },
  {
    icon: LandPlot,
    label: "Tài sản đấu giá",
    href: "/me/asset",
  },
  {
    icon: FileClock,
    label: "Lịch sử đấu giá",
    href: "/me/history",
  },
  {
    icon: BadgeDollarSign,
    label: "Phiên đấu giá của tôi",
    href: "/me/auction",
  },
];

export const auctioneerRoutes = [
  {
    icon: Layout,
    label: "Phiên đấu giá",
    href: "/auctioneer",
  },
  {
    icon: Layout,
    label: "Tài sản",
    href: "/auctioneer/asset",
  },
];
