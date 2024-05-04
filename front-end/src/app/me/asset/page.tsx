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
  const searchParams = useSearchParams();
  const [asset, setAsset] = useState<assetData[]>([]);

  const page = parseInt(searchParams.get('page') ?? '1');
  const skip = parseInt(searchParams.get('skip') ?? '2');

  const [filter, setFilter] = useState<filterAssetData>(
    {
      sort: undefined,
      name: undefined,
      description: undefined,
      owner: undefined,
      auctioneer: undefined,
      verified: undefined,
      page: page,
      skip: skip,
    }
  );

  const debouncedFilter = useDebounce(filter,1000);
  console.log(filter);

  useEffect(() => {
    setLoading(true);
    listAsset(debouncedFilter).then(res => {
      // setAsset(res.data.data.assets);
    }).finally(() => {
      var dataAsset = [];
      var dataAsset2 = [];
      if (1) {
        dataAsset = [
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
          {
            _id: '2',
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
          {
            _id: '3',
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
          {
            _id: '4',
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
          {
            _id: '5',
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
          {
            _id: '6',
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
          {
            _id: '7',
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
          {
            _id: '8',
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
        dataAsset2 = [
          {
            _id: '111111',
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
          {
            _id: '2',
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
          {
            _id: '3',
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
          {
            _id: '4',
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
          {
            _id: '5',
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
          {
            _id: '6',
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
          {
            _id: '7',
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
          {
            _id: '8',
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
      }
      setAsset(page == 2 ? dataAsset2 : dataAsset);
      if (filter.skip) setPageCount(Math.ceil(dataAsset.length / filter.skip));
      setLoading(false);
    })
  }, [debouncedFilter, searchParams]);

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
      {!loading && <DataTable columns={columns} data={asset} pageCount={pageCount}/>}
    </div>
  );
}
