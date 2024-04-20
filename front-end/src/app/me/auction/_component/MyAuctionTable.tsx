import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function MyAuctionTable() {
    return (
        <div className="w-full">
            <Table>
                <TableCaption>Danh sách phiên đấu giá</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">STT</TableHead>
                        <TableHead>Mã phiên đấu giá</TableHead>
                        <TableHead>Mã tài sản</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thời gian mở đăng kí</TableHead>
                        <TableHead>Thời gian kết thúc đăng kí</TableHead>
                        <TableHead className="text-center">Chi tiết</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>MTS-LEHETC</TableCell>
                        <TableCell>10/04/2024 08:00:00</TableCell>
                        <TableCell>19/04/2024 17:00:00</TableCell>
                        <TableCell>22.623.000.000 VNĐ</TableCell>
                        <TableCell>22.623.000.000 VNĐ</TableCell>
                        <TableCell className="text-center">
                            <Button variant={"ghost"} className="text-purpleColor"><Eye /></Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}