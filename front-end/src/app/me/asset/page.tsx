'use client';
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Filter, Upload, UserPlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PropertyForm from "./_component/PropertyForm";
import { columns } from "./_component/columns";
import { DataTable } from "../../../components/ui/data-table";
import { useCallback, useEffect, useState } from "react";
import { assetData, filterAssetData } from "@/lib/constant/dataInterface";
import { listAsset } from "@/app/api/apiEndpoints";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/lib/hook/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [openVerify, setOpenVerify] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [asset, setAsset] = useState<assetData[]>([]);
  const [filterActive, setActive] = useState(true);
  const [filterSuspend, setSuspend] = useState(true);

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  const [filter, setFilter] = useState<filterAssetData>(
    {
      sort: undefined,
      name: undefined,
      description: undefined,
      owner: undefined,
      auctioneer: undefined,
      verified: undefined,
      page: page,
      limit: limit,
    }
  );

  const debouncedFilter = useDebounce(filter);

  useEffect(() => {
    setFilter(prevFilter => ({
      ...prevFilter,
      page: page,
      limit: limit
    }))
  }, [searchParams])

  useEffect(() => {
    if (!openVerify) {
      setLoading(true);
      listAsset(debouncedFilter).then(res => {
        setAsset(res.data.data.assets);
        setPageCount(res.data.data.totalPages);
      }).finally(() => {
        setLoading(false);
      })
    }
  }, [debouncedFilter, openVerify]);

  useEffect(() => {
    setFilter(prevFilter => ({
      ...prevFilter,
      verified: handleFilterVerified(filterActive, filterSuspend),
    }))
  }, [filterActive, filterSuspend]);

  const handleFilterVerified = (isActive: any, isSuspended: any) => {
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
                        id="description"
                        placeholder="Lọc theo mô tả"
                        className="h-8"
                        onChange={(e) => {
                          setFilter(prevFilter => ({
                            ...prevFilter,
                            description: e.target.value,
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
                            Đã xác thực
                          </DropdownMenuCheckboxItem>

                          <DropdownMenuCheckboxItem
                            checked={filterSuspend}
                            onCheckedChange={setSuspend}
                          >
                            Chưa xác thực
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
                <Upload />
                <p className="ml-2">Đăng kí tài sản đấu giá</p>
              </Button>
            </DialogTrigger>
            <PropertyForm setClose={setOpenVerify} open={openVerify} />
          </Dialog>
        </div>
      </div>

      <DataTable columns={columns} data={asset} pageCount={pageCount} />
    </div>
  );
}
