"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm items-center">
      <div className="p-6">
        <Link href={"/"} className="">
          <Logo />
        </Link>
      </div>
      <div className="flex flex-col w-full whitespace-nowrap">
        <SidebarRoutes />
      </div>
    </div>
  );
};
