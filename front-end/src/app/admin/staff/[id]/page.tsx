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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { getUserProfileByID, suspenUser } from "@/app/api/apiEndpoints";
import { userData, auctionData } from "@/lib/constant/dataInterface";
import { listAuctionManaging } from "@/app/api/apiEndpoints";
import { DataTable } from "@/components/ui/data-table";
import { columns_auctions } from "@/app/auctioneer/(auctionSesion)/_component/columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HTTP_STATUS } from "@/lib/constant/constant";
import { toast } from "sonner";

export default function StaffDetail({ params, searchParams }: any) {
  const id = params.id;
  const [user, setUser] = useState<userData>();
  const [pageCount, setPageCount] = useState(0);
  const [listItem, setListItem] = useState<auctionData[]>([]);
  const [isActive, setActive] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listAuctionManaging({
          auctioneer_id: user?._id,
        });
        setPageCount(response.data.totalPages);
        setListItem(response.data.auctions);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [user?._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserProfileByID(id);
        console.log(response.data.data);
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleSuspendUser = (active: any) => {
    console.log(user?.active);
    if (active === "true") {
      console.log("okela");
      suspenUser(user?._id as String, { active: true })
        .then((res) => {
          if (res.status == HTTP_STATUS.OK) {
            toast.success("Bỏ đình chỉ người dùng thành công !");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Vui lòng thử lại.");
        });
    }
    if (active === "false") {
      console.log("okela111");
      suspenUser(user?._id as String, { active: false })
        .then((res) => {
          if (res.status == HTTP_STATUS.OK) {
            toast.success("Đình chỉ người dùng thành công !");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Vui lòng thử lại.");
        });
    }
  };

  return (
    <div className="container">
      <Card className="">
        <CardHeader>
          <CardTitle>Thông tin nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          {user && (
            <div className="grid w-full items-center gap-4">
              <div className="grid grid-cols-2 gap-4  ">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name || ""}
                    disabled={true}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="ssid">CCCD</Label>
                  <Input
                    id="ssid"
                    defaultValue={user?.ssid || ""}
                    disabled={true}
                    className="rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4  ">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    defaultValue={user?.phone || ""}
                    disabled={true}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    defaultValue={user?.email || ""}
                    disabled={true}
                    className="rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Trạng thái</Label>
                  {/* <Input id="phone" defaultValue={user?.active ? 'Hoạt động' : 'Đình chỉ'} className="rounded-full" /> */}
                  <Select
                    defaultValue={user?.active?.toString()}
                    onValueChange={(e) => {
                      handleSuspendUser(e);
                    }}
                  >
                    <SelectTrigger className="w-full rounded-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="true">Hoạt động</SelectItem>
                        <SelectItem value="false">Đình chỉ</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Xác minh</Label>
                  <Input
                    id="email"
                    defaultValue={
                      user?.verified ? "Đã xác minh" : "Chưa xác minh"
                    }
                    disabled
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Phiên đấu giá phụ trách</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns_auctions}
            data={listItem}
            pageCount={pageCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
