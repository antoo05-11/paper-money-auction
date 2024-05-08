"use client";
import { useState } from "react";
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";
import { listAuction } from "../api/apiEndpoints";
import { useEffect } from "react";
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react";

export default function ListItem() {
  const [listItem, setListItem] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState();
  const [param, setParam] = useState();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const route = useRouter();
  const path_name = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listFirst = await listAuction(null);
        const data_asset = listFirst.data.auctions;
        console.log(data_asset)
        setListItem(data_asset);
        setTotalPage(listFirst.data.totalPages)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {isLoading &&
        <div className="container">
          <Skeleton className="h-screen bg-transparent" />
        </div>
      }
      {
        !isLoading &&
        <div className="pt-20 pb-10 container grid grid-cols-8 gap-4">
          <div className="col-span-3 p-8">
            <div className="bg-white p-8 border shadow rounded-lg flex flex-col gap-4">
              <h1 className="font-bold text-2xl">Tìm kiếm</h1>
              <Input placeholder="Tìm theo tên sản phẩm..." className="max-w-2xl rounded-full" />
              <div className="flex flex-row gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {startDate ? format(startDate, "PPP") : <span>Từ ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {endDate ? format(endDate, "PPP") : <span>Đến ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" variant={"editBtn"} className="shadow-none w-1/2">Tìm kiếm</Button>
            </div>

          </div>

          <div className="col-span-5">
            {listItem?.map((e: any) => {
              return <CardItem infor_auction={e} key={e._id} />;
            })}

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                </PaginationItem>
                {[...Array(totalPage)].map((_, index) => (
                  <PaginationItem key={index}>
                    <Button className="rounded" variant={"outline"}>
                      {index + 1}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

        </div>
      }
    </>
  );
}

function CardItem({ infor_auction }: any) {
  console.log(infor_auction);

  const route = useRouter();
  const path_name = usePathname();
  return (
    <div className="flex flex-row justify-between max-w-4xl bg-white container mb-8 mt-8 p-0 shadow rounded-lg border">
      <div className="p-8 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">{infor_auction?.asset?.name}</h1>
          <p>Mô tả sản phẩm: Tiền rất đẹp</p>
          <p>Thời gian mở đấu giá: {new Date(infor_auction.auction_start).toLocaleString()}</p>
          <Button
            className="w-1/2 mt-3"
            variant={"editBtn"}
            onClick={() => {
              route.push(`${path_name}/${infor_auction._id}`);
            }}
          >
            Chi tiết
          </Button>
        </div>
      </div>
      <div className="w-3/12">
        <Image src={"/demoimage.jpg"} alt="Image" width={200} height={300} className="w-full h-full rounded-r-lg" />
      </div>
    </div>
  );
}

