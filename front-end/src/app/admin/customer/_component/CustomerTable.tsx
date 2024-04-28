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
                                    <Button variant={"ghost"} className="text-purpleColor"><Eye /></Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant={"ghost"} className="text-red-500"><Ban /></Button>
                                        </AlertDialogTrigger>

                                        <CustomAlert variant="BAN" />
                                    </AlertDialog>
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
                                    <Button variant={"ghost"} className="text-purpleColor">
                                        <Eye />
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant={"ghost"} className="text-highlightColor">
                                                <Undo2 />
                                            </Button>
                                        </AlertDialogTrigger>

                                        <CustomAlert variant="UNDO" />
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Card>
    );
}