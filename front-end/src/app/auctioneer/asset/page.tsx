"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { listAsset } from "@/app/api/apiEndpoints";
import { filterAssetData } from "@/lib/constant/dataInterface";
import { usePathname, useRouter } from "next/navigation";
import { DataTable } from "../_component/data_table";
import { columns_assets } from "./_component/columns";

export default function Page() {
  const [list_asset, setListAsset] = useState<any>(null);
  const [param, setParam] = useState<filterAssetData>();
  useEffect(() => {
    let input: any = null;
    const fetchData = async () => {
      const data_get = await listAsset(input);
      // const json = await data_get.json()
      const data_asset = await data_get.data.data.assets;
      console.log(data_asset);
      setListAsset(data_asset);
    };
    const result = fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="w-[80%]">
          <div className="w-full flex flex-row">
            <Input className="w-full border-b-2 border-t-0 border-r-0 border-l-0 outline-0" />
            <Button>Search</Button>
          </div>
          <DataTable columns={columns_assets} data={list_asset}></DataTable>
        </div>
      </div>
    </div>
  );
}
