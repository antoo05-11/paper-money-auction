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
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton";

export default function ListItem() {
  const [listItem, setListItem] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [param, setParam] = useState();
  const route = useRouter();
  const path_name = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listFirst = await listAuction();
        const data_asset = listFirst.data.auctions;
        setListItem(data_asset);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {isLoading &&
        <div className="container">
          <Skeleton className="h-screen bg-transparent" />
        </div>
      }
      {
        !isLoading && <div className="pt-20">
          <div className="flex w-full items-center space-x-2 justify-center">
            <Input placeholder="Tên sản phẩm" className="w-96" />
            <Button type="submit">Tìm kiếm</Button>
          </div>
          {listItem?.map((e: any) => {
            return <CardItem infor_auction={e} key={e._id} />;
          })}
          {/* <CardItem /> */}
        </div>
      }

    </>
  );
}

function CardItem(infor_auction: any) {
  console.log(infor_auction?._id);
  const route = useRouter();
  const path_name = usePathname();
  return (

    <div className="flex flex-row justify-between max-w-4xl bg-white container mb-8 mt-8 p-0 shadow rounded-lg border">
      <div className="p-8 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">Rổng đỏ Macao</h1>
          <p>Mô tả sản phẩm: Tiền rất đẹp</p>
          <p>Thời gian mở đấu giá: 24/11/2003</p>
          <Button
            className="w-1/2 mt-3"
            variant={"editBtn"}
            onClick={(e: any) => {
              route.push(path_name + infor_auction?.id);
            }}
          >
            Chi tiết
          </Button>
        </div>
      </div>
      <div>
        <Image src={"/demoimage.jpg"} alt="Image" width={200} height={300} className="w-full h-full rounded-r-lg" />
      </div>
    </div>
  );
}
