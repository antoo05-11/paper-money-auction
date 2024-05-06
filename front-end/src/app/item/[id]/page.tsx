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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
import { useState } from "react";
import { viewAuctionInfo } from "@/app/api/apiEndpoints";
import { useEffect } from "react";
import { joinAuctionSession } from "@/app/api/apiEndpoints";
export default function CustomerDetail({ params, searchParams }: any) {
  const id = params.id;
  const [infor_auction, set_infor_auction] = useState();
  const [startSession, setStartSession] = useState(false);
  const [onSession, setOnSession] = useState(false);
  const [registered, setRegister] = useState(false);
  const [autionToken, setAutionToken] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const data_get = await viewAuctionInfo(id);
      // const json = await data_get.json()
      const data_use = await data_get.data;
      // console.log(data_use);

      set_infor_auction(data_use);
    };
    const result = fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  useEffect(() => {
    const getAuctionToken = async (id: any) => {
      const token = await joinAuctionSession(id);
      setAutionToken(token.data);
    };
    if (onSession) {
      const result = getAuctionToken(id).catch(console.error);
    }
  }, [onSession]);
  return (
    <div className="flex flex-col justify-center items-center">
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
                  {startSession && (
                    <div>
                      {registered && (
                        <div>
                          {onSession && (
                            <div className="grid grid-cols-4">
                              <Input type="number" className="col-span-3" />
                              <Button className="col-span-1">Trả giá</Button>
                            </div>
                          )}
                          {!onSession && (
                            <Button
                              className="w-full"
                              onClick={(e) => {
                                setOnSession(true);
                              }}
                            >
                              Tham gia phiên đấu giá
                            </Button>
                          )}
                        </div>
                      )}
                      {!registered && (
                        <Button className="w-full">
                          Đã quá thời hạn đăng kí tham gia
                        </Button>
                      )}
                    </div>
                  )}
                  {!startSession && (
                    <div>
                      {!registered && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button>Đăng kí tham gia đấu giá</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắn muốn tham gia phiên đấu giá này
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Sau khi đăng kí bạn sẽ phải chờ sự phê duyệt từ
                                đấu giá viên
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  setRegister(true);
                                }}
                              >
                                Đồng ý
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {registered && (
                        <Button className="col-span-1 w-full">
                          Bạn đã đăng kí tham gia
                        </Button>
                      )}
                    </div>
                  )}
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

function CountTime(endTime: any) { }
