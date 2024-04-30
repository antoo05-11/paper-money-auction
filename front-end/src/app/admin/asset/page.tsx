"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { listAsset } from "@/app/api/apiEndpoints";
import { filterAssetData } from "@/lib/constant/dataInterface";
import { list } from "postcss";
import { usePathname, useRouter } from "next/navigation";
export default function Page() {
  const [list_asset, setListAsset] = useState<any>(null);
  const [param, setParam] = useState<filterAssetData>();
  const route = useRouter();
  const path_name = usePathname();
  useEffect(() => {
    let input: any = null;
    const fetchData = async () => {
      const listFisrt = await listAsset(input);
      // const json = await listFisrt.json()
      const data_asset = await listFisrt.data.data.assets;
      // console.log(data_asset);
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
          <Table>
            <TableCaption>Danh sách tài sản</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">STT</TableHead>
                <TableHead>Mã tài sản</TableHead>
                <TableHead>Chủ nhân tài sản</TableHead>
                <TableHead>Mô tả tài sản</TableHead>
                <TableHead className="text-right">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list_asset?.map((data: any) => {
                return (
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>1234567890</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={(e) => {
                          route.push(path_name + data?.id);
                        }}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
