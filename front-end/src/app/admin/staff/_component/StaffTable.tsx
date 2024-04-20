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
import { Ban, Undo2, Eye, Pencil } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StaffTable() {
    return (
        <Card className="shadow">
            <div className="flex flex-col justify-center items-center my-7 container">
                <div className="w-full">
                    <Table>
                        <TableCaption>Danh sách nhân viên</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">STT</TableHead>
                                <TableHead className="w-[150px]">Mã nhân viên</TableHead>
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
                                    <Button variant={"ghost"} className="text-purpleColor"><Eye /></Button>
                                    <Button variant={"ghost"} className="text-red-500"><Ban /></Button>
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
                                    <Button variant={"ghost"} className="text-purpleColor"><Eye /></Button>
                                    <Button variant={"ghost"} className="text-highlightColor"><Undo2 /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Card>
    );
}