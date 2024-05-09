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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HTTP_STATUS } from "@/lib/constant/constant";
import { toast } from "sonner";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import { getUserProfileByID, listAsset, suspenUser } from "@/app/api/apiEndpoints";
import { assetData, userData, filterAssetData } from "@/lib/constant/dataInterface";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/me/asset/_component/columns";

export default function CustomerDetail({ params, searchParams }: any) {
  const id = params.id;
  const [user, setUser] = useState<userData>();
  const [pageCount, setPageCount] = useState(0);
  const [listItem, setListItem] = useState<assetData[]>([]);
  const [isActive, setActive] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserProfileByID(id);
        setUser(response.data.data)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [id])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.email) {
          const filter: filterAssetData = {
            owner: user?.email,
            sort: undefined,
            name: undefined,
            description: undefined,
            verified: undefined,
            page: undefined,
            limit: undefined
          };
          const response = await listAsset(filter);
          setPageCount(response.data.data.totalPages);
          setListItem(response.data.data.assets);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [user?.email]);

  const handleSuspendUser = (active: any) => {
    if (active === "true") {
      console.log("okela")
      suspenUser(user?._id as String, { "active": true }).then((res) => {
        if (res.status == HTTP_STATUS.OK) {
          toast.success("Bỏ đình chỉ người dùng thành công !")
        }
      })
        .catch((err) => {
          console.log(err);
          toast.error("Vui lòng thử lại.");
        });
    }
    if (active === "false") {
      console.log("okela111")
      suspenUser(user?._id as String, { "active": false }).then((res) => {
        if (res.status == HTTP_STATUS.OK) {
          toast.success("Đình chỉ người dùng thành công !")
        }
      })
        .catch((err) => {
          console.log(err);
          toast.error("Vui lòng thử lại.");
        });
    }
  }

  return (
    <div className="container">
      <Card className="">
        <CardHeader>
          <CardTitle>Thông tin khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {user && <div className="grid w-full items-center gap-4">
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
                {/* <Input id="phone" defaultValue={user?.active ? 'Hoạt động' : 'Đình chỉ'} disabled className="rounded-full" /> */}
                <Select defaultValue={user?.active?.toString()} onValueChange={(e) => { handleSuspendUser(e) }}>
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
                <Input id="email" defaultValue={user?.verified ? 'Đã xác minh' : 'Chưa xác minh'} disabled className="rounded-full" />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" defaultValue={user?.address || ''} disabled={true} className="rounded-full" />
            </div>
          </div>}
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Tài sản</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={listItem} pageCount={pageCount} />
        </CardContent>
      </Card>
    </div>
  );
}
