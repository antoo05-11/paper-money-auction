"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomerDetail({ params, searchParams }: any) {
  const id = params.id;
  return (
    <div className="flex flex-col justify-center items-center">
      <Card className="absolute h-[90%] w-[80%] top-0">
        <CardHeader>
          <CardTitle>Thông tin phiên đấu giá</CardTitle>
          {/* <CardDescription></CardDescription> */}
        </CardHeader>
        <CardContent>
          <div>Các thông tin về phiên đấu giá</div>
          <div>Người đấu giá</div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p>Danh sách khánh hàng tham gia đấu gia</p>
          <Table>
            <TableCaption>Danh sách nhân viên</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">STT</TableHead>
                <TableHead>Tên phiên đấu giá</TableHead>
                <TableHead>Mã phiên đấu giá</TableHead>
                <TableHead>Thời gian bắt đầu đấu giá</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell>$250.00</TableCell>
                <TableCell>$250.00</TableCell>
                <TableCell>
                  <Button>Chi tiết</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardFooter>
      </Card>
    </div>
  );
}
