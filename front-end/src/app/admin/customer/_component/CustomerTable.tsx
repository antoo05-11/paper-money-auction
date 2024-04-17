import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ban, Check, Eye, Pencil } from 'lucide-react';
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

export default function CustomerTable() {
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
                            <TableRow>
                                <TableCell className="font-medium">1</TableCell>
                                <TableCell>#FFF</TableCell>
                                <TableCell>Duy ngu</TableCell>
                                <TableCell>duyngu@g.c</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="common">Hoạt động</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button variant={"ghost"}><Eye /></Button>
                                    <Button variant={"ghost"}><Ban /></Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">1</TableCell>
                                <TableCell>#FFF</TableCell>
                                <TableCell>Duy ngu</TableCell>
                                <TableCell>duyngu@g.c</TableCell>
                                <TableCell className="text-center">
                                    <Badge>Đình chỉ</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button variant={"ghost"}><Eye /></Button>
                                    <Button variant={"ghost"}><Check /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Card>
    );
}