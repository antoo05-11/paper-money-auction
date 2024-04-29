"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ban, Undo2, Eye, Pencil } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    AlertDialog,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CustomAlert } from "../../../component/CustomAlert";

import { getAllUser } from "@/app/api/apiEndpoints";
import { useEffect, useState } from "react";

interface User {
    _id: string;
    email: string;
    name: string;
    ssid: string;
    phone: string;
    active: boolean;
}

export default function CustomerTable() {
    const [listUser, setListUser] = useState<User[] | undefined>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllUser({
                    name: null,
                    ssid: null,
                    phone: null,
                    email: null,
                    active: null,
                    role: "customer",
                    page: undefined,
                    limit: undefined
                });
                setListUser(response.data.listUser);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Card className="shadow">
            <div className="flex flex-col justify-center items-center my-7 container">
                <div className="w-full">
                    <Table>
                        <TableCaption>Danh sách khách hàng</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">STT</TableHead>
                                <TableHead className="w-[150px]">Mã khách hàng</TableHead>
                                <TableHead>Họ và tên</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-center">Trạng thái</TableHead>
                                <TableHead className="text-center">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listUser && listUser.map((user, index) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>#{user.ssid}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={user.active ? "common" : "secondary"}>
                                            {user.active ? "Hoạt động" : "Đình chỉ"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant={"ghost"} className="text-purpleColor"><Eye /></Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant={"ghost"} className="text-red-500"><Ban /></Button>
                                            </AlertDialogTrigger>

                                            <CustomAlert variant="BAN" />
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </div>
            </div>
        </Card>
    );
}