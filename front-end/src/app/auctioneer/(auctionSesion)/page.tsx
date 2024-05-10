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
import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
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
  const [date_auction, set_date_auction] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [date_register, set_date_register] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  useEffect(() => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      registration_close: date_register?.to?.toISOString(),
      registration_open: date_register?.from?.toISOString(),
      auction_end: date_auction?.to?.toISOString(),
      auction_start: date_auction?.from?.toISOString(),
      page: page,
      page_size: limit,
    }));
  }, [searchParams, limit, page, date_auction, date_register]);
  useEffect(() => {
    const fetchData = async (filter: any) => {
      const data = await listAuctionManaging(filter);
      const data_use = await data?.data?.auctions;
      update_list_auction(data_use);
    };
    const result = fetchData(debouncedFilter).catch(console.error);
  }, [debouncedFilter]);
  return (
    <div className="container">
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
                    <div className="grid gap-2">
                      <Label>Thời gian đăng ký</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !date_register && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date_register?.from ? (
                              date_register.to ? (
                                <>
                                  {format(date_register.from, "LLL dd, y")} -{" "}
                                  {format(date_register.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date_register.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date_register?.from}
                            selected={date_register}
                            onSelect={set_date_register}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label>Thời gian đấu giá</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !date_auction && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date_auction?.from ? (
                              date_auction.to ? (
                                <>
                                  {format(date_auction.from, "LLL dd, y")} -{" "}
                                  {format(date_auction.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date_auction.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date_auction?.from}
                            selected={date_auction}
                            onSelect={set_date_auction}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div>
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
