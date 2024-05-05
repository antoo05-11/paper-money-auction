"use client";
import { Input } from "@/components/ui/input";
import AssetTable from "./_component/AssetTable";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import { assetData, filterAssetData } from "@/lib/constant/dataInterface";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hook/useDebounce";
import { listAsset } from "@/app/api/apiEndpoints";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./_component/columns";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const searchParams = useSearchParams();
  const [listAssetManage, setListAssetManage] = useState<assetData[]>([]);

  const page = parseInt(searchParams.get('page') ?? '1');
  const skip = parseInt(searchParams.get('skip') ?? '10');

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

  const debouncedFilter = useDebounce(filter, 1000);

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

  return (
    <div className="container">
      <div className="flex justify-between mb-5">
        <div className="flex flex-row">
          <Input
            className="rounded-full leading-none text-gray-800 dark:text-white bg-transparent focus:outline-none shadow"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>

      {loading && <Skeleton className="w-[100px] h-[20px] rounded-full" />}
      {!loading && <DataTable columns={columns} data={listAssetManage} pageCount={pageCount} />}
    </div>
  );
}
