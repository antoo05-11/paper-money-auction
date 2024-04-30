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
import AuctionSessionTable from "@/app/auctioneer/_component/AuctionSessionTable";
import { useEffect, useState } from "react";
import { getUserProfileByID } from "@/app/api/apiEndpoints";
import { userData } from "@/lib/constant/dataInterface";

export default function StaffDetail({ params, searchParams }: any) {
  const id = params.id;
  const [user, setUser] = useState<userData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserProfileByID(id);
        console.log(response.data.data)
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [id])

  return (
    <div className="container">
      <Card className="">
        <CardHeader>
          <CardTitle>Thông tin nhân viên</CardTitle>
          {/* <CardDescription></CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="grid grid-cols-2 gap-4  ">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" defaultValue={user?.name || ''} disabled={true} className="rounded-full" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ssid">CCCD</Label>
                <Input id="ssid" defaultValue={user?.ssid || ''} disabled={true} className="rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4  ">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" defaultValue={user?.phone || ''} disabled={true} className="rounded-full" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email || ''} disabled={true} className="rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Trạng thái</Label>
                <Input id="phone" defaultValue={user?.active ? 'Hoạt động' : 'Đình chỉ'} disabled className="rounded-full" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Xác minh</Label>
                <Input id="email" defaultValue={user?.verified ? 'Đã xác minh' : 'Chưa xác minh'} disabled className="rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <AuctionSessionTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
