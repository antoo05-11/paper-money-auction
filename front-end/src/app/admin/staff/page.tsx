"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hook/useDebounce";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./_component/columns";
import { filterUserData, userData } from "@/lib/constant/dataInterface";
import { getAllUser } from "@/app/api/apiEndpoints";
import { useEffect, useState } from "react";
import React from "react";
import StaffForm from "./_component/StaffForm";
import { UserPlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Filter } from "lucide-react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from 'next/navigation'

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const searchParams = useSearchParams();
  const [listUser, setListUser] = useState<userData[]>([]);
  const [openVerify, setOpenVerify] = useState(false);
  const [filterActive, setActive] = useState(true);
  const [filterSuspend, setSuspend] = useState(true);
  const router = useRouter();
  const pathName = usePathname();

  const columnsMemo = React.useMemo(() => columns, []);

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  const [filter, setFilter] = useState<filterUserData>(
    {
      sort: undefined,
      name: undefined,
      ssid: undefined,
      phone: undefined,
      email: undefined,
      active: undefined,
      role: "auctioneer",
      page: page,
      limit: limit,
    }
  );

  const debouncedFilter = useDebounce(filter, 1000);

  useEffect(() => {
    setFilter(prevFilter => ({
      ...prevFilter,
      page: page,
      limit: limit
    }))
  }, [searchParams, limit, page])

  useEffect(() => {
    setFilter(prevFilter => ({
      ...prevFilter,
      active: handleFilterActive(filterActive, filterSuspend),
    }))
  }, [filterActive, filterSuspend]);

  useEffect(() => {
    setLoading(true);
    getAllUser(debouncedFilter).then(res => {
      const modifiedData = res.data.data.listUser.map((user: userData) => ({
        ...user,
        active: user.active ? "Hoạt động" : "Đình chỉ"
      }));
      setListUser(modifiedData);
      setPageCount(res.data.data.totalPages);
    }).finally(() => {
      setLoading(false);
    })
  }, [debouncedFilter]);

  const handleFilterActive = (isActive: any, isSuspended: any) => {
    if (isActive && isSuspended) {
      return undefined;
    } else if (isActive && !isSuspended) {
      return true;
    } else if (!isActive && isSuspended) {
      return false;
    }
  };

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
              <PopoverContent className="w-80 ml-40" >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Bộ lọc</h4>
                  </div>
                  <div className="grid gap-2">
                    <div className=" items-center gap-4">
                      <Input
                        id="width"
                        placeholder="Lọc theo tên"
                        value={filter?.name}
                        className="h-8"
                        defaultValue={""}
                        onChange={(e) => {
                          setFilter(prevFilter => ({
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
                        id="maxWidth"
                        placeholder="Lọc theo email"
                        value={filter?.email}
                        className="h-8"
                        onChange={(e) => {
                          setFilter(prevFilter => ({
                            ...prevFilter,
                            email: e.target.value,
                          }))
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                    <div className=" items-center gap-4">
                      <Input
                        id="height"
                        placeholder="Lọc theo số điện thoại"
                        value={filter?.phone}
                        className="h-8"
                        onChange={(e) => {
                          setFilter(prevFilter => ({
                            ...prevFilter,
                            phone: e.target.value,
                          }))
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                    <div className="items-center gap-4">
                      <DropdownMenu >
                        <DropdownMenuTrigger asChild >
                          <Button variant="outline" className="rounded-lg w-full justify-start">Trạng thái</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuCheckboxItem
                            checked={filterActive}
                            onCheckedChange={setActive}
                          >
                            Hoạt động
                          </DropdownMenuCheckboxItem>

                          <DropdownMenuCheckboxItem
                            checked={filterSuspend}
                            onCheckedChange={setSuspend}
                          >
                            Đình chỉ
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

        <div>
          <Dialog open={openVerify} onOpenChange={setOpenVerify}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus />
                <p className="ml-2">Tạo nhân viên</p>
              </Button>
            </DialogTrigger>

            <StaffForm setClose={setOpenVerify} open={openVerify} />

          </Dialog>
        </div>
      </div>
      <div>
        {<DataTable columns={columnsMemo} data={listUser} pageCount={pageCount} />}
      </div>
    </div>
  );
}
