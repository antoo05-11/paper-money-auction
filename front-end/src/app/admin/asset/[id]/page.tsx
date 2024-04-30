"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { viewAsset } from "@/app/api/apiEndpoints";
import { useEffect, useState } from "react";
export default function CustomerDetail({ params, searchParams }: any) {
  const id = params.id;
  const [infor_asset, set_infor_asset] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      const listFisrt = await viewAsset(id);
      // const json = await listFisrt.json()
      const data_asset = await listFisrt.data.data;
      console.log(data_asset);
      set_infor_asset(data_asset);
    };
    const result = fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[80%] top-0 bot-0">
        <Card className="top-0 bot-0">
          <CardHeader>
            <CardTitle>Phê duyệt tài sản</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-7 gap-4">
            <Card className="bg-cyan-400 col-span-4">
              Hinh anh
              <image></image>
            </Card>
            <div className=" col-span-3 gap-4 h-80">
              <Card className=" bg-cyan-400 row-span-4 gap-4 h-80">
                <CardTitle>Phê duyệt tài sản</CardTitle>
                <CardContent>
                  <p>Chủ nhân tài sản: {infor_asset?.owner?.email}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="col-span-1 w-full">Từ chối</Button>
                    <Button className="col-span-1 w-full">Phê duyệt</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col"></CardFooter>
        </Card>
        <Tabs>
          <TabsList>
            <TabsTrigger value="describe">Mô tả tài sản</TabsTrigger>
            <TabsTrigger value="document">Tài liệu liên quan</TabsTrigger>
          </TabsList>
          <TabsContent value="describe">{infor_asset?.description}</TabsContent>
          <TabsContent value="document">{infor_asset?.docs}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
