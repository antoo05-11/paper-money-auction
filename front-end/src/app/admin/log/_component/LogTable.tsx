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

export default function LogTable() {
    return (
        <div className="w-full">
            <Table>
                <TableCaption>Lịch sử thao tác</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">STT</TableHead>
                        <TableHead>Mã thao tác</TableHead>
                        <TableHead>Mã người thực hiện</TableHead>
                        <TableHead>Mã đối tượng</TableHead>
                        <TableHead>Loại đối tượng</TableHead>
                        <TableHead>Thời điểm thực hiện</TableHead>
                        <TableHead>Trạng thái</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>123456789</TableCell>
                        <TableCell>123456789</TableCell>
                        <TableCell>123456789</TableCell>
                        <TableCell>123456789</TableCell>
                        <TableCell>123456789</TableCell>
                        <TableCell>123456789</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}