import { Input } from "@/components/ui/input";
import AuctionSessionTable from "../_component/AuctionSessionTable";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";


export default function Page() {
    return (
        <div className="container">
            <div className="flex justify-between mb-5">
                <div className="flex flex-row">
                    <Input
                        className="rounded-full leading-none text-gray-800 dark:text-white bg-transparent focus:outline-none shadow"
                        placeholder="Search..."
                        type="text"
                    />
                </div>
                <div>
                    <Button variant={"createBtn"}>
                        <UserPlus />
                        <p className="ml-2">Tạo phiên đấu giá</p>
                    </Button>
                </div>
            </div>
            <AuctionSessionTable />
        </div>
    );
}