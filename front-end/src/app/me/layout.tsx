import { Sidebar } from "../../components/_layout/sidebar";
import { MobileSidebar } from "../../components/_layout/mobile-sidebar";
import TopBar from "../../components/_layout/topbar";
import { serverRole } from "@/lib/utils";
import { ROLES } from "@/lib/constant/constant";
import { redirect } from "next/navigation";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const role = serverRole();
  if (role == ROLES.CUSTOMER) {
    return (
      <div className="h-full">
        <MobileSidebar />
        <div className="hidden md:flex h-full w-60 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>
        <main className="md:pl-56 h-full">
          <TopBar />
          {children}
        </main>
      </div>
    );
  } else {
    redirect("/403");
  }
};

export default UserLayout;
