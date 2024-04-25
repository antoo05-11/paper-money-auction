"use client"
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { UserPlus } from 'lucide-react';
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useContext, useEffect, useState } from "react";
import { getProfile } from "@/app/api/apiEndpoints";
import { SessionContext } from "@/lib/auth/session";

const frameworks = [
  {
    value: "1",
    label: "MB",
  },
  {
    value: "2",
    label: "SHB",
  },
  {
    value: "3",
    label: "BIDV",
  },
  {
    value: "4",
    label: "VCB",
  },
  {
    value: "5",
    label: "TECHCOMBANK",
  },
]

export default function Page() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [profileData, setProfileData] = useState(null);
  const session = useContext(SessionContext);
  console.log(session);

  useEffect(() => {
    let ignore = false;
    setProfileData(null);
    getProfile().then(res => {
      if (!ignore) {
        setProfileData(res.data);
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <div className="container">
      <div className="flex justify-between mb-5">
        <div className="flex flex-row w-full">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="password">Mật khẩu</TabsTrigger>
              <TabsTrigger value="bank">Thanh toán</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" defaultValue="" placeholder="Nguyễn Văn A" className="rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">CCCD</Label>
                    <Input id="username" defaultValue="" placeholder="123456789000" className="rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">Email</Label>
                    <Input id="username" defaultValue="" placeholder="abc@g.c" className="rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">Phone</Label>
                    <Input id="username" defaultValue="" placeholder="0123456789" className="rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">Địa chỉ</Label>
                    <Input id="username" defaultValue="" placeholder="Hà Nộ, Việt Nam" className="rounded-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant={"createBtn"}>Lưu thay đổi</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Thay đổi mật khẩu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Mật khẩu hiện tại</Label>
                    <Input id="current" type="password" className="rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">Mật khẩu mới</Label>
                    <Input id="new" type="password" className="rounded-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant={"createBtn"}>Lưu thay đổi</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="bank">
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Chủ tài khoản</Label>
                    <Input id="name" className="rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="current">Số tài khoản</Label>
                    <Input id="name" className="rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new" className="mr-3">Ngân hàng</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between"
                        >
                          {value
                            ? frameworks.find((framework) => framework.value === value)?.label
                            : "Chọn ngân hàng..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Tìm ngân hàng..." />
                          <CommandEmpty>Không tìm thấy ngân hàng nào</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {frameworks.map((framework) => (
                                <CommandItem
                                  key={framework.value}
                                  value={framework.value}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === framework.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {framework.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant={"createBtn"}>Lưu thay đổi</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
