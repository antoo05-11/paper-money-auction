"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";
import { listAuction } from "../api/apiEndpoints";
import { useEffect } from "react";
export default function ListItem() {
  const [listItem, setListItem] = useState<any>(null);
  const [param, setParam] = useState();
  const route = useRouter();
  const path_name = usePathname();
  useEffect(() => {
    let input: any = null;
    const fetchData = async () => {
      const listFisrt = await listAuction(input);
      // const json = await listFisrt.json()
      const data_asset = await listFisrt.data;
      console.log(data_asset);
      setListItem(data_asset);
    };
    const result = fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);
  return (
    <div>
      <div className="flex w-full items-center space-x-2 justify-center mt-6">
        <Input placeholder="Tên sản phẩm" className="w-96" />
        <Button type="submit">Tìm kiếm</Button>
      </div>
      {listItem?.map((e: any) => {
        return <CardItem infor_auction={e} />;
      })}
      {/* <CardItem /> */}
    </div>
  );
}

function CardItem(infor_auction: any) {
  const route = useRouter();
  const path_name = usePathname();
  return (
    <Card className="bg-red-200 container mb-8 mt-8 max-w-5xl">
      <CardHeader>
        <CardTitle>Tên sản phẩm</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Hình ảnh sản phẩm</p>
        <p>Thông tin sản phẩm</p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={(e: any) => {
            route.push(path_name + infor_auction?.id);
          }}
        >
          Chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}
