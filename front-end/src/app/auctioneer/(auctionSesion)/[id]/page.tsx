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
import { socket } from "@/app/socket";
import ListBidder from "../../_component/ListBidder";
export default function CustomerDetail({ params }: any) {
  const [isConnected, setIsConnected] = useState(false);
  const id = params.id;
  const [infor_auction, set_infor_auction] = useState<any>();
  const [startSession, setStartSession] = useState(true);
  const [onSession, setOnSession] = useState(false);
  const [list_bidder, update_list_bidder] = useState();
  const [autionToken, setAutionToken] = useState<string>();
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const fetchData = async () => {
      const listFisrt = await viewAuctionInfo(id);
      // const json = await listFisrt.json()
      const data_use = await listFisrt.data;
      console.log(data_use);
      set_infor_auction(data_use);
    };
    const result = fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  useEffect(() => {
    const getAuctionToken = async (id: any) => {
      const data_use = await joinAuctionSession(id);
      const token: string = await data_use.data.data?.token?.replace(
        "Bearer ",
        ""
      );
      setAutionToken(token);
      console.log(token);
    };
    function onConnect() {
      setIsConnected(true);
      // setTransport(socket.io.engine.transport.name);

      // socket.io.engine.on("upgrade", (transport) => {
      //   setTransport(transport.name);
      // });
    }

    function onDisconnect() {
      setIsConnected(false);
      // setTransport("N/A");
    }
    const result = getAuctionToken(id).catch(console.error);
    if (onSession) {
      socket.connect();

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("socket_error", (message) => {
        console.log("socket_error: ", message);
      });
      socket.on("join_session_response", (response) => {
        console.log("join_session_response");
        console.log(response);
      });
      socket.on("attendees_update", (response) => {
        console.log("attendees_update: " + response);
      });
      socket.on("make_offer_response", (message) => {
        console.log("make_offer_response");
        console.log(message);
      });
      socket.on("biddings_update", (message) => {
        console.log("biddings_update");
        console.log(message);
      });
      socket.on("start_session_response", (message) => {
        console.log("start_session_response");
        console.log(message);
      });
      socket.on("join_session_response", (message) => {
        console.log("join_session_response");
        console.log(message);
      });

      console.log("start session");
      socket.emit("start_session", autionToken);
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("socket_error");
        socket.off("join_session_response");
        socket.off("attendees_update");
        socket.off("make_offer_response");
        socket.off("biddings_update");
        socket.off("start_session_response");
        socket.off("join_session_response");
      };
    }
  }, [onSession]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Button
        onClick={() => {
          // const hihi = new Date(infor_auction?.auction_end);
          console.log(autionToken);
          console.log(socket.connected);
        }}
      >
        {isConnected && <div>Connected</div>}
        {!isConnected && <div>Disconnected</div>}
      </Button>
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
                <CardTitle>Đặt giá</CardTitle>
                <CardContent>
                  <p>Giá cao nhất hiện tại</p>
                  <p>Người trả giá cao nhất</p>
                  <p>Giá khởi điểm: {infor_auction?.starting_price} vnd</p>
                  <p>Bước giá: {infor_auction?.bidding_increment} vnd</p>
                  {startSession && (
                    <div className="w-full">
                      {!onSession && (
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button className="w-full">
                              Bắt đầu phiên đấu giá
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắn muốn bắt phiên đấu giá này
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  setOnSession(true);
                                }}
                              >
                                Bắt đầu
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {onSession && (
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button>Kết thúc phiên đấu giá</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắn muốn kết thúc phiên đấu giá này
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  setStartSession(true);
                                }}
                              >
                                Kết thúc
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  )}
                  {!startSession && (
                    <Button className="w-full">
                      Chưa đến giờ bắt đầu phiên đấu giá
                    </Button>
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
          <TabsContent value="inform">
            <ListBidder auction_id={infor_auction?._id}></ListBidder>
          </TabsContent>
          <TabsContent value="describe">Change your password here.</TabsContent>
          <TabsContent value="document">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CountTime(endTime: any) {}
