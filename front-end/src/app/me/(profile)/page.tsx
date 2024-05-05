"use client"
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { UserPlus, X } from 'lucide-react';
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
import { getProfile, requestVerify, updateProfile } from "@/app/api/apiEndpoints";
import { useAuth } from "@/lib/auth/useAuth";
import { profileData } from "@/lib/constant/dataInterface";
import VerifyAccount from "./verify-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { HTTP_STATUS } from "@/lib/constant/constant";
import { toast } from "sonner";

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

export default function ProfileCustomerPage() {
  const [open, setOpen] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [value, setValue] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isVerifying, setVerify] = useState(false);
  const [editProfile, setEditingProfile] = useState(false);

  const [profileData, setProfileData] = useState<profileData | null>(null);
  useEffect(() => {
    getProfile().then((res) => {
      setProfileData(res.data.data.user);
      setNewProfile(profileData);
      setLoading(false);
    });
  }, []);

  const [newProfile, setNewProfile] = useState<profileData | null>(null);
  const handleChangeProfile = () => {
    if (editProfile) {
      updateProfile(newProfile).then(res => {
        if (res.status == HTTP_STATUS.OK) {
          toast.success('Cập nhật thông tin thành công');
          setProfileData(newProfile);
          setEditingProfile(false);
        }
      }).catch(err => {
        console.log(err);
        toast.error('Vui lòng thử lại.')
      })
    } else {
      setEditingProfile(!editProfile);
    }
  }

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
                    <Input id="name" 
                    defaultValue="" 
                    placeholder={profileData?.name ?? ''} 
                    className={`rounded-full ${!editProfile ? 'placeholder:text-black !opacity-100' : ''}`} 
                    disabled={!editProfile}
                    onChange={(e) => setNewProfile(prevProfile => ({
                      ...prevProfile,
                      name: e.target.value,
                    }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ssid">CCCD</Label>
                    <Input id="ssid"  
                    placeholder={profileData?.ssid ?? ''} 
                    className={`rounded-full ${!editProfile ? 'placeholder:text-black !opacity-100' : ''}`} 
                    disabled={!editProfile} 
                    onChange={(e) => setNewProfile(prevProfile => ({
                      ...prevProfile,
                      ssid: e.target.value,
                    }))} />
                  </div>
                  <div className="">
                    <Label htmlFor="email" className="justify-between items-end flex" >
                      Email
                      {profileData?.verified == false && 
                        <Dialog open={openVerify} onOpenChange={setOpenVerify} >
                        <DialogTrigger asChild>
                          <Button className="h-1/4 text-xs" >Xác minh email</Button>
                        </DialogTrigger>
            
                        <VerifyAccount setClose={setOpenVerify} open={openVerify}/>
                      </Dialog>
                      }
                    </Label>
                    <Input id="email"
                    placeholder={
                      profileData?.email ? (profileData?.verified ? profileData?.email?.concat(' (verified)') : profileData?.email) : ''
                    }
                    className={`rounded-full mb-5 mt-2 ${!editProfile ? 'placeholder:text-black !opacity-100' : ''}`} 
                    disabled={!editProfile} 
                    onChange={(e) => setNewProfile(prevProfile => ({
                      ...prevProfile,
                      email: e.target.value,
                    }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone"
                     defaultValue="" 
                     placeholder={profileData?.phone ?? ''} 
                     className={`rounded-full ${!editProfile ? 'placeholder:text-black !opacity-100' : ''}`} 
                     disabled={!editProfile} 
                     onChange={(e) => setNewProfile(prevProfile => ({
                      ...prevProfile,
                      phone: e.target.value,
                    }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input id="address" 
                    placeholder={profileData?.address ?? ''} 
                    className={`rounded-full ${!editProfile ? 'placeholder:text-black !opacity-100' : ''}`} 
                    disabled={!editProfile}
                    onChange={(e) => setNewProfile(prevProfile => ({
                      ...prevProfile,
                      address: e.target.value,
                    }))} />
                  </div>
                </CardContent>
                <CardFooter className="space-x-2">
                  <Button variant={"createBtn"} onClick={handleChangeProfile}>{editProfile ? 'Lưu thay đổi' : 'Sửa thông tin'}</Button>
                  {editProfile &&
                  <Button onClick={() => setEditingProfile(false)}>
                    <X />
                  </Button>}
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
