"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { listAuctionManaging } from "@/app/api/apiEndpoints";
import { DataTable } from "../_component/data_table";
import { columns_auctions } from "./_component/columns";
export default function Page() {
  const [list_auction, update_list_auction] = useState();
  const [filter, setFilter] = useState<any>(null);

  useEffect(() => {
    const fetchData = async (filter: any) => {
      const data = await listAuctionManaging(filter);
      const data_use = await data?.data?.auctions;
      console.log(data_use);

      update_list_auction(data_use);
    };
    const result = fetchData(filter).catch(console.error);
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
      </div>
      <div className="flex flex-col justify-center items-center my-7 container">
        <DataTable columns={columns_auctions} data={list_auction}></DataTable>
      </div>
    </div>
  );
}
