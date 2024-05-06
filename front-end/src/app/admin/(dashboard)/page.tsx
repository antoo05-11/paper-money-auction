"use client";

import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Overview from "../_component/Overview";
const StaffStatistic = dynamic(() => import("../_component/AuctionStatistic"), {
  ssr: false,
});
const UserStatistic = dynamic(() => import("../_component/AssetStatistic"), {
  ssr: false,
});
const PostStatistic = dynamic(() => import("../_component/PostStatistic"), {
  ssr: false,
});
import StaffTable from "../staff/_component/StaffTable";
import { getAllUser } from "@/app/api/apiEndpoints";
import { useEffect, useMemo, useState } from "react";
import { userData } from "@/lib/constant/dataInterface";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../staff/_component/columns";

export default function AdminPage() {
  const [listUser, setListUser] = useState<userData[]>([]);
  const columnsMemo = useMemo(() => columns, []);

  useEffect(() => {
    getAllUser({
      sort: undefined,
      name: undefined,
      ssid: undefined,
      phone: undefined,
      email: undefined,
      active: undefined,
      role: "auctioneer",
      page: 1,
      limit: 10,
    }).then(res => {
      const modifiedData = res.data.data.listUser.map((user: userData) => ({
        ...user,
        active: user.active ? "Hoạt động" : "Đình chỉ"
      }));
      setListUser(modifiedData);
    }).finally(() => {
    })
  }, []);

  return (
    <div className="container ">
      <div className="w-full">
        <Overview />
      </div>

      <div className="w-full flex mt-3 gap-4">
        <div className="basis-1/2">
          <StaffStatistic />
        </div>
        <div className="basis-1/2">
          <UserStatistic />
        </div>
      </div>

      <div className="mt-3">
        {<DataTable columns={columnsMemo} data={listUser} pageCount={1} />}
      </div>
    </div>
  );
}
