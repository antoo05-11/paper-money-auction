'use client';
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Upload, UserPlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PropertyForm from "./_component/PropertyForm";
import { useAuth } from "@/lib/auth/useAuth";
import { columns } from "./_component/columns";
import { DataTable } from "../../../components/ui/data-table";
import { useEffect, useState } from "react";
import { assetData, filterAssetData } from "@/lib/constant/dataInterface";
import { listAsset } from "@/app/api/apiEndpoints";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/lib/hook/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState<assetData[]>([]);
  const [filter, setFilter] = useState<filterAssetData>(
    {
      sort: undefined,
      name: undefined,
      description: undefined,
      owner: undefined,
      auctioneer: undefined,
      verified: undefined,
      page: 1,
      skip: 10,
    }
  );

  const debouncedFilter = useDebounce(filter,1000);

  useEffect(() => {
    setLoading(true);
    listAsset(debouncedFilter).then(res => {
      const dataAsset = [
        {
          _id: '1',
          owner: {
            _id: 'thoseid',
            email: 'caomn@gmail.com'
          },
          name: 'Tien rong macao',
          description: 'Tien qua dep',
          pics: [{
            name: 'buc anh dep',
            _id: 'idanh'
            
          }],
          docs: [{
            name: 'tai lieu hay',
            _id: 'doc_id'
          }],
          verified: true
        },
      ];
      // setAsset(res.data.data.assets);
      setAsset(dataAsset);
      setLoading(false);
    })
  }, [debouncedFilter]);

  return (
    <div className="container">
     <div className="flex flex-col mb-5">
        <div className="md:mb-0 self-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"createBtn"}>
                <Upload />
                <p className="ml-2">Đăng kí tài sản đấu giá</p>
              </Button>
            </DialogTrigger>
            <PropertyForm />
          </Dialog>
        </div>        
        <div className="grid grid-cols-4 mt-5 md:mt-0 space-x-8">
          <Input
            className="rounded-full leading-none text-gray-800 dark:text-white bg-transparent focus:outline-none shadow text-xs w-2/3"
            placeholder="Name"
            id="name"
            type="text"
            onChange={(e) => setFilter(prevFilter => ({
              ...prevFilter,
              name: e.target.value,
            }))}
          />
          <Input
            className="rounded-full text-gray-800 dark:text-white bg-transparent focus:outline-none shadow text-xs w-3/4"
            placeholder="Description"
            id="description"
            type="text"
            onChange={(e) => setFilter(prevFilter => ({
              ...prevFilter,
              description: e.target.value,
            }))}
          />
          <Input
            className="rounded-full text-gray-800 dark:text-white bg-transparent focus:outline-none shadow text-xs w-3/4"
            placeholder="Owner@gmail.com"
            id="Owner"
            type="text"
            onChange={(e) => setFilter(prevFilter => ({
              ...prevFilter,
              owner: e.target.value,
            }))}
          />
          <Input
            className="rounded-full text-gray-800 dark:text-white bg-transparent focus:outline-none shadow text-xs w-3/4"
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

      {loading && <Skeleton className="w-[100px] h-[20px] rounded-full" />}
      {!loading && <DataTable columns={columns} data={asset} />}
    </div>
  );
}
