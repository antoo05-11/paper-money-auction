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
// import CountTime from "../_component/countTime";
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
import React, { useRef, useState } from "react";
import { listBidder, viewAuctionInfo } from "@/app/api/apiEndpoints";
import { useEffect } from "react";
import { joinAuctionSession } from "@/app/api/apiEndpoints";
import { socket } from "@/app/socket";
import ListBidder from "../../_component/ListBidder";
import {
  attendees_bidding,
  verified_bidder,
  bidding_act,
} from "../_component/columns";
import { DataTable } from "@/components/ui/data-table";
export default function AuctionDetail({ params }: any) {
  const [isConnected, setIsConnected] = useState(false);
  const id = params.id;
  const [infor_auction, set_infor_auction] = useState<any>();
  const [startSession, setStartSession] = useState(true);
  const [onSession, setOnSession] = useState(false);
  const [list_bidder, update_list_bidder] = useState<any>();
  const [autionToken, setAutionToken] = useState<string>();
  const [time, setTime] = useState(Date.now());
  const [list_bidder_attend, update_list_bidder_attend] = useState<any>([]);
  const [bidding_history, update_bidding_history] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      const dataAution = await viewAuctionInfo(id)
        .then((data) => data.data)
        .then((data) => set_infor_auction(data))
        .catch(console.error);
      const dataBidder = await listBidder(id)
        .then((data) => data.data.data)
        .then((data) => update_list_bidder(data))
        .catch(console.error);
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
      // console.log(token);
    };
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
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
        update_list_bidder_attend(JSON.parse(response));
      });
      socket.on("make_offer_response", (message) => {
        console.log("make_offer_response");
        console.log(message);
      });
      socket.on("biddings_update", (message) => {
        console.log("biddings_update");
        console.log(message);
        update_bidding_history(message);
      });
      socket.on("start_session_response", (message) => {
        console.log("start_session_response");
        console.log(message);
      });

      console.log("start session");
      socket.emit("start_session", autionToken);
      console.log("join session");
      socket.emit("join_session", autionToken);
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
      <div className="w-[80%] top-0 bot-0">
        <Card className="top-0 bot-0">
          <CardHeader>
            <CardTitle>Phiên đấu giá</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-7 gap-4">
            <Card className="bg-cyan-400 col-span-4">Hinh anh</Card>
            <div className=" col-span-3 grid grid-rows-6 gap-4">
              <CountTime
                startTime={infor_auction?.auction_start}
                endTime={Date.now()}
              />
              <Card className=" bg-cyan-400 row-span-4">
                <CardTitle>Đặt giá</CardTitle>
                <CardContent>
                  <p>Giá cao nhất hiện tại</p>
                  <p>Người trả giá cao nhất</p>
                  <p>Giá khởi điểm: {infor_auction?.starting_price} vnd</p>
                  <p>
                    Bước giá tối thiểu: {infor_auction?.bidding_increment} vnd
                  </p>
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
            {startSession && (
              <TabsTrigger value="history">Lịch sử đặt giá</TabsTrigger>
            )}
            <TabsTrigger value="inform">Thông tin người đấu giá</TabsTrigger>
            <TabsTrigger value="describe">Mô tả tài sản</TabsTrigger>
            <TabsTrigger value="document">Tài liệu liên quan</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <DataTable
              columns={bidding_act}
              data={bidding_history}
              pageCount={0}
            ></DataTable>
          </TabsContent>
          <TabsContent value="inform">
            {startSession && (
              <DataTable
                columns={attendees_bidding}
                data={list_bidder_attend}
                pageCount={0}
              />
            )}
            {!startSession && (
              <DataTable
                columns={verified_bidder}
                data={list_bidder}
                pageCount={1}
              />
            )}
          </TabsContent>
          <TabsContent value="describe">Change your password here.</TabsContent>
          <TabsContent value="document">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const CountTime: React.FC<{
  startTime: string | number;
  endTime: string | number;
}> = ({ startTime, endTime }) => {
  const countRef = useRef<any>(null);
  const DateEnd = new Date(endTime);
  const DateStart = new Date(startTime);
  const [time, setTime] = useState<number>(0);
  useEffect(() => {
    setTime(
      Math.floor(Math.abs(DateStart.getTime() - DateEnd.getTime()) / 1000)
    );
    countRef.current = setInterval(() => {
      setTime((time) => time - 1);
    }, 1000);
  }, [endTime, startTime]);
  return (
    <Card className=" bg-cyan-400 row-span-2 grid grid-cols-4 text-center">
      <div className="row-span-1">Day: {Math.floor(time / 86400)}</div>
      <div className="row-span-1">Giờ: {Math.floor(time / 3600) % 24}</div>
      <div>Phút: {Math.floor(time / 60) % 60}</div>
      <div>Giây: {time % 60}</div>
      <button
        onClick={() => {
          setTime(
            Math.floor(Math.abs(DateStart.getTime() - DateEnd.getTime()) / 1000)
          );
          console.log(time % 60);
        }}
      >
        Test
      </button>
    </Card>
  );
};
