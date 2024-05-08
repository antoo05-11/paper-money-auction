"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import UserMenu from "./user-menu";
import { ModeToggle } from "./mode-toggle";

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const routes = pathname.split("/").filter((path) => path !== "");
  const listRoutes = routes.map(
    (route, index) => "/" + routes.slice(0, index + 1).join("/")
  );

  return (
    <div className="container flex justify-between items-center h-14 mb-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator />
          {listRoutes.map((route, index) => (
            <div key={index} className="inline-flex items-center">
              <BreadcrumbItem className="mr-2">
                <BreadcrumbLink href={route}>
                  {route.split("/")[index + 1].charAt(0).toUpperCase() +
                    route.split("/")[index + 1].slice(1) +
                    " "}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index != listRoutes.length - 1 && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pr-4 flex space-x-4">
        <ModeToggle />
        <UserMenu />
      </div>
    </div>
  );
}
