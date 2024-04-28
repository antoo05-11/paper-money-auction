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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Car } from "lucide-react";

export default function CustomerDetail({ params, searchParams }: any) {
  const id = params.id;
  return (
    <div className="flex flex-col inline justify-center items-center">
      <div className="w-[80%] top-0 bot-0">
        <Card className="top-0 bot-0">
          <CardHeader>
            <CardTitle>Phiên đấu giá</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-7 gap-4">
            <Card className="bg-cyan-400 col-span-4">Hinh anh</Card>
            <div className=" col-span-3 grid grid-rows-6 gap-4">
              <Card className=" bg-cyan-400 row-span-2 grid grid-cols-3 text-center">
                <div className="row-span-1">Giờ</div>
                <div>Phút</div>
                <div>Giây</div>
              </Card>
              <Card className=" bg-cyan-400 row-span-4">
                <CardTitle>Dat gia</CardTitle>
                <CardContent>
                  <p>Gia cao nhat hien tai</p>
                  <p>Gia khoi diem</p>
                  <p>Buoc gia</p>
                  <p>Gia cao nhat cua ban</p>
                  <p>Ban dang tra gia</p>
                  <div className="grid grid-cols-4">
                    <Input type="number" className="col-span-3" />
                    <Button className="col-span-1">Tra gia</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col"></CardFooter>
        </Card>
        <Tabs>
          <TabsList>
            <TabsTrigger value="history">Lịch sử đặt giá</TabsTrigger>
            <TabsTrigger value="inform">Thông tin đấu giá</TabsTrigger>
            <TabsTrigger value="describe">Mô tả tài sản</TabsTrigger>
            <TabsTrigger value="document">Tài liệu liên quan</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Table className="justify-center items-center">
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
          </TabsContent>
          <TabsContent value="inform">Change your password here.</TabsContent>
          <TabsContent value="describe">Change your password here.</TabsContent>
          <TabsContent value="document">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
