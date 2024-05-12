"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { listAuction } from "../api/apiEndpoints";
import { useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import path from "path";

const FILE_SERVER_URL =
  process.env.FILE_SERVER ||
  "https://muzik-files-server.000webhostapp.com/paper-money-auction-files/asset-docs/";

import { useDebounce } from "@/lib/hook/useDebounce";
import { DateRange } from "react-day-picker";
import { filterAuctionData } from "@/lib/constant/dataInterface";
import { Label } from "@/components/ui/label";
export default function ListItem() {
  const router = useRouter();
  const pathName = usePathname();
  const [listItem, setListItem] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [filter, setFilter] = useState<filterAuctionData>();
  const debouncedFilter = useDebounce(filter, 1000);
  const [search, setSearch] = useState(false);
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
      page: undefined,
      page_size: undefined,
    }));
  }, [date_auction, date_register]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listFirst = await listAuction(debouncedFilter);
        const data_asset = listFirst.data.auctions;
        setListItem(data_asset);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);
  return (
    <>
      {isLoading && (
        <div className="container">
          <Skeleton className="h-screen bg-transparent" />
        </div>
      )}
      {!isLoading && (
        <div className="pt-20 pb-10 container grid grid-cols-8 gap-4">
          <div className="p-8 fixed">
            <div className="bg-card p-8 border shadow rounded-lg flex flex-col gap-4">
              <h1 className="font-bold text-2xl">Tìm kiếm</h1>
              <Input
                placeholder="Tìm theo tên sản phẩm..."
                className="max-w-2xl rounded-full"
                value={filter?.asset}
                onChange={(e) => {
                  setFilter((prevFilter: any) => ({
                    ...prevFilter,
                    asset: e.target.value,
                  }));
                }}
              />
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
              <Button
                onClick={() => setSearch((search) => !search)}
                className="shadow-none w-1/2"
              >
                Tìm kiếm
              </Button>
            </div>
          </div>

          <div className="col-span-3"></div>
          <div className="col-span-5">
            {listItem?.map((e: any) => {
              return <CardItem infor_auction={e} key={e._id} />;
            })}

            {/* <Pagination>
              <PaginationContent>
                <PaginationItem></PaginationItem>
                {[...Array(totalPage)].map((_, index) => (
                  <PaginationItem key={index}>
                    <Button className="rounded" variant={"outline"}>
                      {index + 1}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem></PaginationItem>
              </PaginationContent>
            </Pagination> */}
          </div>
        </div>
      )}
    </>
  );
}

function CardItem({ infor_auction }: any) {
  let imageUrl = "";
  if (
    infor_auction &&
    infor_auction.asset?.pics &&
    infor_auction.asset?.pics[0]
  ) {
    imageUrl = `${FILE_SERVER_URL}${
      infor_auction.asset?.pics[0]._id
    }${path.extname(infor_auction.asset?.pics[0].name)}`;
  }

  const route = useRouter();
  const path_name = usePathname();
  return (
    <div className="flex flex-row justify-between max-w-4xl bg-card container mb-8 mt-8 p-0 shadow rounded-lg border">
      <div className="p-8 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">{infor_auction?.asset?.name}</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Mô tả sản phẩm: {infor_auction?.asset?.description}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Thời gian mở đăng kí:{" "}
            {new Date(infor_auction.registration_open).toLocaleString()}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Thời gian mở đấu giá:{" "}
            {new Date(infor_auction.auction_start).toLocaleString()}
          </p>
          <Button
            className="w-1/2 mt-3"
            onClick={() => {
              route.push(`${path_name}/${infor_auction._id}`);
            }}
          >
            Chi tiết
          </Button>
        </div>
      </div>
      <div className="w-3/12">
        <Image
          src={imageUrl}
          alt="Image"
          width={200}
          height={300}
          className="w-full h-full rounded-r-lg"
        />
      </div>
    </div>
  );
}
