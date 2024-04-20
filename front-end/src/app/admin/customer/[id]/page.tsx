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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import MyAuctionTable from "@/app/me/auction/_component/MyAuctionTable";

export default function CustomerDetail({ params, searchParams }: any) {
  const id = params.id;
  return (
    <div className="container">
      <Card className="">
        <CardHeader>
          <CardTitle>Thông tin khách hàng</CardTitle>
          {/* <CardDescription></CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="grid grid-cols-2 gap-4  ">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" defaultValue={"ALoo"} disabled={true} className="rounded-full" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">CCCD</Label>
                <Input id="name" defaultValue={"ALoo"} disabled={true} className="rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4  ">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Số điện thoại</Label>
                <Input id="name" defaultValue={"ALoo"} disabled={true} className="rounded-full" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input id="name" defaultValue={"ALoo"} disabled={true} className="rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <MyAuctionTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
