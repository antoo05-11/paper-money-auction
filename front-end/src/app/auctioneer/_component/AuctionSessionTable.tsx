import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AuctionSessionTable() {
    return (
        <Card className="shadow">
            <div className="flex flex-col justify-center items-center my-7 container">
                <div className="w-full">
                    <Table>
                        <TableCaption>Danh sách phiên đấu giá</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">STT</TableHead>
                                <TableHead>Mã tài sản</TableHead>
                                <TableHead>Thời gian mở đăng ký</TableHead>
                                <TableHead>Thời gian kết thúc đăng ký</TableHead>
                                <TableHead>Giá khởi điểm</TableHead>
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
                                <TableCell className="text-center">
                                    <Button variant={"editBtn"}><Pencil /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Card>
    );
}