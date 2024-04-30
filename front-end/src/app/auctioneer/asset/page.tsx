"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { listAsset } from "@/app/api/apiEndpoints";
import { auctionData, filterAssetData } from "@/lib/constant/dataInterface";
import { list } from "postcss";
import { usePathname, useRouter } from "next/navigation";
import { createAuction } from "@/app/api/apiEndpoints";
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
                <TableHead>Tên tài sản</TableHead>
                <TableHead>Chủ nhân tài sản</TableHead>
                <TableHead>Mô tả tài sản</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list_asset?.map((data: any) => {
                return (
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>{data?.name}</TableCell>
                    <TableCell>{data?.owner?.email}</TableCell>
                    <TableCell>{data?.description}</TableCell>
                    <TableCell>
                      {data?.verified ? "Chưa tạo phiên đấu giá" : "Đã tạo"}
                    </TableCell>
                    <TableCell className="text-right">
                      <CreateAuction></CreateAuction>
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

function CreateAuction() {
  const [auction, setAuction] = useState<auctionData>();
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Tạo phiên đấu giá</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Tạo phiên đấu giá</DialogTitle>
            <DialogDescription>
              Tạo phiên đấu giá sau khi đã thảo luận với chủ tài sản. Nhấn tạo
              để tạo phiên đấu giá
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="starting_price" className="text-right">
                Giá khời điểm
              </Label>
              <Input id="starting_price" className="col-span-3" type="number" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bidding_increment" className="text-right">
                Bước giá
              </Label>
              <Input
                id="bidding_increment"
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-8 items-center gap-4">
              <Label
                htmlFor="bidding_increment"
                className="text-right col-span-2"
              >
                Thời gian đăng kí
              </Label>
              <Input
                id="bidding_increment"
                className="col-span-3"
                type="number"
              />
              <Input
                id="bidding_increment"
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-8 items-center gap-4">
              <Label
                htmlFor="bidding_increment"
                className="text-right col-span-2"
              >
                Thời gian bắt đầu
              </Label>
              <Input
                id="bidding_increment"
                className="col-span-3"
                type="number"
              />
              <Input
                id="bidding_increment"
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bidding_increment" className="text-right">
                Số lượng tối đa người tham gia
              </Label>
              <Input
                id="bidding_increment"
                className="col-span-3"
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Tạo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
