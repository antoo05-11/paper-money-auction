"use client";
import { Input } from "@/components/ui/input";
import AssetTable from "./_component/AssetTable";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState, useMemo } from "react";
import { assetData, filterAssetData } from "@/lib/constant/dataInterface";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hook/useDebounce";
import { listAsset } from "@/app/api/apiEndpoints";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./_component/columns";
import { Button } from "@/components/ui/button"
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
  const [listAssetManage, setListAssetManage] = useState<assetData[]>([]);
  const [filterVerified, setFilterVerified] = useState(true);
  const [filterNotVerified, setFilterNotVerified] = useState(true);
  const router = useRouter();
  const pathName = usePathname();

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  const columnsMemo = useMemo(() => columns, []);

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
      verified: handleFilterVerified(filterVerified, filterNotVerified),
    }))
  }, [filterVerified, filterNotVerified]);

  useEffect(() => {
    setLoading(true);
    listAsset(debouncedFilter).then(res => {
      const modifiedData = res.data.data.assets.map((asset: assetData) => ({
        ...asset,
        verified: asset.verified ? "Phê duyệt" : "Chưa phê duyệt"
      }));
      setListAssetManage(modifiedData);
      setPageCount(res.data.data.totalPages);
    }).finally(() => {
      setLoading(false);
    })
  }, [debouncedFilter, searchParams]);

  const handleFilterVerified = (isVerified: any, isNotVerified: any) => {
    if (isVerified && isNotVerified) {
      return undefined;
    } else if (isVerified && !isNotVerified) {
      return true;
    } else if (!isVerified && isNotVerified) {
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
                          }));
                          router.push(`${pathName}/?page=1&limit=10`);
                        }}
                      />
                    </div>
                    <div className=" items-center gap-4">
                      <Input
                        id="maxWidth"
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
                            checked={filterVerified}
                            onCheckedChange={setFilterVerified}
                          >
                            Phê duyệt
                          </DropdownMenuCheckboxItem>

                          <DropdownMenuCheckboxItem
                            checked={filterNotVerified}
                            onCheckedChange={setFilterNotVerified}
                          >
                            Chưa phê duyệt
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

      {<DataTable columns={columnsMemo} data={listAssetManage} pageCount={pageCount} />}
    </div>
  );
}
