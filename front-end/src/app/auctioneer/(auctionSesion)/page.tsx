"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { listAuctionManaging } from "@/app/api/apiEndpoints";
import { DataTable } from "@/components/ui/data-table";
import { columns_auctions } from "./_component/columns";
import { useRouter, usePathname } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hook/useDebounce";
import {
  assetData,
  auctionData,
  filterAuctionData,
} from "@/lib/constant/dataInterface";
import { Label } from "@/components/ui/label";
export default function Page() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const [list_auction, update_list_auction] = useState<assetData[]>();
  const [filter, setFilter] = useState<filterAuctionData>();
  const debouncedFilter = useDebounce(filter, 1000);
  useEffect(() => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      page: page,
      page_size: limit,
    }));
  }, [searchParams, limit, page]);
  useEffect(() => {
    const fetchData = async (filter: any) => {
      const data = await listAuctionManaging(filter);
      const data_use = await data?.data?.auctions;
      console.log(data_use);
      update_list_auction(data_use);
    };
    const result = fetchData(debouncedFilter).catch(console.error);
  }, [debouncedFilter]);
  return (
    <div className="container">
      <Button
        onClick={() => {
          console.log(filter);
        }}
      >
        Test
      </Button>
      <div className="flex justify-between mb-5">
        <div className="flex flex-row">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter />
                  <span>Bộ lọc</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 ml-40">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Bộ lọc</h4>
                  </div>
                  <div className="grid gap-2">
                    <div className=" items-center gap-4">
                      <Input
                        id="filter_name"
                        placeholder="Lọc theo tên"
                        className="h-8"
                        value={filter?.asset}
                        onChange={(e) => {
                          setFilter((prevFilter: any) => ({
                            ...prevFilter,
                            asset: e.target.value,
                          }));
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                    <div className="items-center gap-4">
                      <Label>Thời gian mở đăng kí</Label>
                      <Input
                        id="filter_registration_open"
                        type="datetime-local"
                        className="h-8"
                        defaultValue={filter?.registration_open?.toJSON()}
                        onChange={(e) => {
                          setFilter((prevFilter: any) => ({
                            ...prevFilter,
                            registration_open: new Date(e.target.value),
                          }));
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                    <div className="items-center gap-4">
                      <Label>Thời gian đóng đăng kí</Label>
                      <Input
                        id="filter_registration_close"
                        type="date"
                        className="h-8"
                        defaultValue={filter?.registration_close?.toISOString()}
                        onChange={(e) => {
                          setFilter((prevFilter: any) => ({
                            ...prevFilter,
                            registration_close: new Date(e.target.value),
                          }));
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                    <div className="items-center gap-4">
                      <Label>Thời gian bắt đầu</Label>
                      <Input
                        id="filter_auction_open"
                        type="datetime-local"
                        defaultValue={filter?.registration_open?.toLocaleTimeString()}
                        className="h-8"
                        onChange={(e) => {
                          setFilter((prevFilter: any) => ({
                            ...prevFilter,
                            auction_open: new Date(e.target.value),
                          }));
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                    <div className="items-center gap-4">
                      <Label>Thời gian kết thúc</Label>
                      <Input
                        id="filter_auction_close"
                        type="datetime-local"
                        className="h-8"
                        onChange={(e) => {
                          setFilter((prevFilter: any) => ({
                            ...prevFilter,
                            auction_close: new Date(e.target.value),
                          }));
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center my-7 container">
        {list_auction && (
          <DataTable
            columns={columns_auctions}
            data={list_auction}
            pageCount={page}
          ></DataTable>
        )}
      </div>
    </div>
  );
}
