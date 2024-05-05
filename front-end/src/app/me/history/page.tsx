'use client';

import { Input } from "@/components/ui/input";
import { columns } from "./_component/columns";
import { DataTable } from "../../../components/ui/data-table";
import { useEffect, useState } from "react";
import { auctionData, filterAuctionData } from "@/lib/constant/dataInterface";
import { listAuction } from "@/app/api/apiEndpoints";
import { useDebounce } from "@/lib/hook/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [auction, setAuction] = useState<auctionData[]>([]);

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  const [filter, setFilter] = useState<filterAuctionData>(
    {
      asset: undefined,
      registration_open: undefined,
      registration_close: undefined,
      registration_open_sorted: undefined,
      registration_close_sorted: undefined,
      auction_start: undefined,
      auction_end: undefined,
      auction_start_sorted: undefined,
      auction_end_sorted: undefined,
      status: undefined,
      page: page,
      page_size: limit
    }
  );

  const debouncedFilter = useDebounce(filter);

  useEffect(() => {
    setFilter(prevFilter => ({
      ...prevFilter,
      page: page,
      page_size: limit
    }))
  }, [searchParams])

  useEffect(() => {
      setLoading(true);
      listAuction(debouncedFilter).then(res => {
        setAuction(res.data.auctions);
        setPageCount(res.data.totalPages);
      }).finally(() => {
        setLoading(false);
      })
  }, [debouncedFilter]);

  return (
    <div className="container">
     <div className="flex flex-col mb-5 space-y-10">
        <div className="grid grid-cols-4 mt-5 md:mt-0 space-x-8 mx-20">
          <div>
            <Input
              className="leading-none text-gray-800 dark:text-white bg-transparent focus:outline-none shadow w-2/3"
              placeholder="Name"
              id="name"
              type="text"
              onChange={(e) => setFilter(prevFilter => ({
                ...prevFilter,
                name: e.target.value,
              }))}
            />
          </div>
          <Input
            className="text-gray-800 dark:text-white bg-transparent focus:outline-none shadow text-xs w-3/4"
            placeholder="Description"
            id="description"
            type="text"
            onChange={(e) => setFilter(prevFilter => ({
              ...prevFilter,
              description: e.target.value,
            }))}
          />
          <Input
            className="text-gray-800 dark:text-white bg-transparent focus:outline-none shadow text-xs w-3/4"
            placeholder="Owner@gmail.com"
            id="Owner"
            type="text"
            onChange={(e) => setFilter(prevFilter => ({
              ...prevFilter,
              owner: e.target.value,
            }))}
          />
          <Input
            className="text-gray-800 dark:text-white bg-transparent focus:outline-none shadow text-xs w-3/4"
            placeholder="Auctioneer@gmail.com"
            id="Auctioneer"
            type="text"
            onChange={(e) => setFilter(prevFilter => ({
              ...prevFilter,
              auctioneer: e.target.value,
            }))}
          />
        </div>
      </div>

      <DataTable columns={columns} data={auction} pageCount={pageCount}/>
    </div>
  );
}
