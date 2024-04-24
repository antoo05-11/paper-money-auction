import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookText, Eye, Send, Trash, Trash2, Undo2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge"

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
import { CustomAlert } from "@/app/component/CustomAlert";

export default function MyPropertyTable() {
    return (
        <Card className="shadow">
            <div className="flex flex-col justify-center items-center my-7 container">
                <div className="w-full">
                    <Table>
                        <TableCaption>Tài sản của tôi</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">STT</TableHead>
                                <TableHead>Tên tài sản</TableHead>

                                <TableHead className="text-center">Trạng thái</TableHead>

                                <TableHead className="text-center">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">1</TableCell>
                                <TableCell>Rổng đỏ Macao</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="destructive">Chờ phê duyệt | Phê duyệt | Từ chối phê duyệt</Badge>
                                </TableCell>

                                <TableCell className="text-center">
                                    <Button variant={"ghost"} className="text-purpleColor">
                                        <Eye />
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant={"ghost"} className="text-highlightColor">
                                                <Send />
                                            </Button>
                                        </AlertDialogTrigger>

                                        <CustomAlert variant="APPROVE" />
                                    </AlertDialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant={"ghost"} className="text-red-500">
                                                <Trash2 />
                                            </Button>
                                        </AlertDialogTrigger>

                                        <CustomAlert variant="DELETE" />
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