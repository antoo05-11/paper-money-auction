'use client';
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Upload, UserPlus } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [openVerify, setOpenVerify] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [asset, setAsset] = useState<assetData[]>([]);

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

  return (
    <div className="container">
     <div className="flex flex-col mb-5 space-y-10">
        <div className="md:mb-0 self-end">
          <Dialog open={openVerify} onOpenChange={setOpenVerify}>
            <DialogTrigger asChild>
              <Button variant={"createBtn"}>
                <Upload />
                <p className="ml-2">Đăng kí tài sản đấu giá</p>
              </Button>
            </DialogTrigger>
            <PropertyForm setClose={setOpenVerify} open={openVerify} />
          </Dialog>
        </div>
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
          <div className="flex items-center space-x-2">
            <Label htmlFor="verified-status">Not Verified</Label>
            <Switch 
              id="verified"
              checked={filter.verified}
              onCheckedChange={(e: any) => setFilter(prevFilter => ({
                ...prevFilter,
                verified: e.valueOf(),
              }))}
            />
            <Label htmlFor="verified-status">Verified</Label>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={asset} pageCount={pageCount}/>
    </div>
  );
}
