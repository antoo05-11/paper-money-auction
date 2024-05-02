"use client"
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Ban, Undo2, Eye, Pencil, BookText } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { assetData } from "@/lib/constant/dataInterface";
import { listAsset } from "@/app/api/apiEndpoints";
import { usePathname, useRouter } from "next/navigation";

export default function AssetTable() {
    const [listAssetManage, setListAssetManage] = useState<assetData[]>();
    const route = useRouter();
    const path_name = usePathname();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let filter: any = null
                const response = await listAsset(filter);
                setListAssetManage(response.data.data.assets);
            } catch (error) {
                console.error("Error fetching assets data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <Card className="shadow">
            <div className="flex flex-col justify-center items-center my-7 container">
                <div className="w-full">
                    <Table>
                        <TableCaption>Danh sách tài sản</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">STT</TableHead>
                                <TableHead>Tên tài sản</TableHead>
                                <TableHead>Chủ nhân tài sản</TableHead>
                                <TableHead>Mô tả tài sản</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-center">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listAssetManage && listAssetManage.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell>{data.owner?.email}</TableCell>
                                    <TableCell>{data.description}</TableCell>
                                    <TableCell>
                                        {data.verified ? "Đã được duyệt" : "Chưa được duyệt"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant={"editBtn"}
                                            onClick={(e) => {
                                                route.push(path_name + "/" + data?._id);
                                            }}>
                                            <BookText />
                                        </Button>
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