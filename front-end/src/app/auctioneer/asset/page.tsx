"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { listAsset } from "@/app/api/apiEndpoints";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns_assets } from "./_component/columns";
import { useDebounce } from "@/lib/hook/useDebounce";
import { assetData, filterAssetData } from "@/lib/constant/dataInterface";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [list_asset, setListAsset] = useState<any>(null);
  const [param, setParam] = useState<filterAssetData>();
  const [page, setPage] = useState<any>();
  const [limit, setLimit] = useState();
  const [filterVerified, setFiltterVerified] = useState<boolean>();
  const [filter, setFilter] = useState<filterAssetData>({
    sort: undefined,
    name: undefined,
    description: undefined,
    owner: undefined,
    auctioneer: undefined,
    verified: undefined,
    page: page,
    limit: limit,
  });
  const debouncedFilter = useDebounce(filter, 1000);
  useEffect(() => {
    const fetchData = async () => {
      const data_get = await listAsset(debouncedFilter);
      const data_asset = await data_get.data.data.assets;
      console.log(data_asset);

      setListAsset(data_asset);
    };
    const result = fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, [debouncedFilter, searchParams]);
  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page: page,
      limit: limit,
    }));
  }, [searchParams, limit, page]);
  useEffect(() => {
    setFilter((prev) => ({ ...prev, verified: filterVerified }));
  }, [filterVerified]);
  return (
    <div className="container">
      <div>
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
                          id="width"
                          placeholder="Lọc theo tên"
                          className="h-8"
                          defaultValue={""}
                          onChange={(e) => {
                            setFilter((prevFilter) => ({
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
                              checked={filterVerified}
                              onCheckedChange={() => {
                                setFiltterVerified(true);
                              }}
                            >
                              Phê duyệt
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuCheckboxItem
                              checked={!filterVerified}
                              onCheckedChange={() => {
                                setFiltterVerified(false);
                              }}
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
        {list_asset && (
          <DataTable
            columns={columns_assets}
            data={list_asset}
            pageCount={page}
          ></DataTable>
        )}
      </div>
    </div>
  );
}
