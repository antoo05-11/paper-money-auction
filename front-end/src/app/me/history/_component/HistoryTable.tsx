import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookText } from 'lucide-react';
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

export default function HistoryTable() {
    return (
        <Card className="shadow">
            <div className="flex flex-col justify-center items-center my-7 container">
                <div className="w-full">
                    <Table>
                        <TableCaption>Lịch sử đấu giá</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">STT</TableHead>
                                <TableHead>Mã đấu giá</TableHead>
                                <TableHead>Tên cuộc đấu giá</TableHead>
                                <TableHead>Mở đấu giá</TableHead>
                                <TableHead className="text-center">Trạng thái</TableHead>
                                <TableHead className="text-center">KQ Trả giá</TableHead>
                                <TableHead className="text-center">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">1</TableCell>
                                <TableCell>#FFAADD</TableCell>
                                <TableCell>Rồng đỏ Macao</TableCell>
                                <TableCell>24/11/2003</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="destructive">Kết thúc</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="success">Trúng đấu giá</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button >
                                        <BookText />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">1</TableCell>
                                <TableCell>#FFAADD</TableCell>
                                <TableCell>Rồng đỏ Macao</TableCell>
                                <TableCell>24/11/2003</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="common">Đang đấu giá</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="destructive">Không trúng đấu giá</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button >
                                        <BookText />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Card>
    );
}