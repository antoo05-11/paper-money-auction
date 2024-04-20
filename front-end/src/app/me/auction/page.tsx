import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { UserPlus } from 'lucide-react';
import MyAuctionTable from "./_component/MyAuctionTable";

export default function Page() {
  return (
    <div className="container">
      <Card className="shadow">
        <div className="flex flex-col justify-center items-center my-7 container">
          <MyAuctionTable />
        </div>
      </Card>
    </div>
  );
}
