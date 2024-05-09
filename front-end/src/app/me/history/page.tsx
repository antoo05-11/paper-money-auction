"use client";

import { Input } from "@/components/ui/input";
import { columns } from "./_component/columns";
import { DataTable } from "../../../components/ui/data-table";
import { useEffect, useState } from "react";
import { auctionData, filterAuctionData } from "@/lib/constant/dataInterface";
import { listRegisteredAuction } from "@/app/api/apiEndpoints";
import { useDebounce } from "@/lib/hook/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [auction, setAuction] = useState<auctionData[]>([]);
  const [filterActive, setActive] = useState(true);
  const [filterSuspend, setSuspend] = useState(true);

  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  const [filter, setFilter] = useState<filterAuctionData>({
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
    page_size: limit,
  });

  const debouncedFilter = useDebounce(filter);

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page: page,
      page_size: limit,
    }));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    listRegisteredAuction(debouncedFilter)
      .then((res) => {
        setAuction(res.data.auctions);
        setPageCount(res.data.totalPages);
        console.log(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedFilter]);

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      status: handleFilterVerified(filterActive, filterSuspend),
    }));
  }, [filterActive, filterSuspend]);

  const handleFilterVerified = (isActive: any, isSuspended: any) => {
    if (isActive && isSuspended) {
      return undefined;
    } else if (isActive && !isSuspended) {
      return "ongoing";
    } else if (!isActive && isSuspended) {
      return "ended";
    }
  };

  return (
    <div className="container">
      <div className="flex flex-col mb-5">
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
                        id="width"
                        placeholder="Lọc theo tên"
                        className="h-8"
                        defaultValue={""}
                        onChange={(e) => {
                          setFilter((prevFilter) => ({
                            ...prevFilter,
                            name: e.target.value,
                            page: 1,
                          }));
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                    <div className=" items-center gap-4">
                      <Input
                        id="description"
                        placeholder="Lọc theo mô tả"
                        className="h-8"
                        onChange={(e) => {
                          setFilter((prevFilter) => ({
                            ...prevFilter,
                            description: e.target.value,
                          }));
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                    <div className="items-center gap-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="rounded-lg w-full justify-start"
                          >
                            Trạng thái
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuCheckboxItem
                            checked={filterActive}
                            onCheckedChange={setActive}
                          >
                            Đang diễn ra
                          </DropdownMenuCheckboxItem>

                          <DropdownMenuCheckboxItem
                            checked={filterSuspend}
                            onCheckedChange={setSuspend}
                          >
                            Kết thúc
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={auction} pageCount={pageCount} />
    </div>
  );
}
