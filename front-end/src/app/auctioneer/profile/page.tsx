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
import { useState } from "react";

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

    return (
        <div className="container">
            <div className="flex justify-between mb-5">
                <div className="flex flex-row w-full">
                    <Tabs defaultValue="account" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="account">Thông tin cá nhân</TabsTrigger>
                            <TabsTrigger value="password">Mật khẩu</TabsTrigger>
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
                                    <Button>Lưu thay đổi</Button>
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
                                    <Button>Lưu thay đổi</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
