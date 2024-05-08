"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AuctionSessionTable from "../_component/AuctionSessionTable";
import AuctionSessionForm from "../_component/AuctionSessionForm";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { listAuctionManaging } from "@/app/api/apiEndpoints";
import { useCookie } from "@/lib/auth/useCookie";
import { useAuth } from "@/lib/auth/useAuth";
export default function Page() {
  const [list_auction, update_list_auction] = useState();
  const [filter, setFilter] = useState<any>(null);

  const auth = useAuth();

  useEffect(() => {
    const fetchData = async (filter: any) => {
      const data = await listAuctionManaging(filter);
      const data_use = await data?.data?.auctions;
      update_list_auction(data_use);
    };
    const result = fetchData(filter)
      // make sure to catch any error
      .catch(console.error);
  }, []);
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus />
                <p className="ml-2">Tạo phiên đấu giá</p>
              </Button>
            </DialogTrigger>

            <AuctionSessionForm />
          </Dialog>
        </div>
      </div>
      <Card className="shadow">
        <div className="flex flex-col justify-center items-center my-7 container">
          <AuctionSessionTable staffID={auth.user?.id} />
        </div>
      </Card>
    </div>
  );
}
