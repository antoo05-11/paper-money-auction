import { Sidebar } from "../../components/_layout/sidebar";
import { MobileSidebar } from "../../components/_layout/mobile-sidebar";
import TopBar from "../../components/_layout/topbar";
import { redirect } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import { ROLES } from "@/lib/constant/constant";
import { serverRole } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
const AuctionneerLayout = ({ children }: { children: React.ReactNode }) => {
  const role = serverRole();
  if (role == ROLES.AUCTIONEER) {
    return (
      <div className="h-full">
        <MobileSidebar />
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>
        <main className="md:pl-56 h-full">
          <TopBar />
          {children}
        </main>
        <Toaster />
      </div>
    );
  } else {
    redirect("/403");
  }
};

export default AuctionneerLayout;
