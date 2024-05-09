"use client";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth/useAuth";
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
import { useRef, useState } from "react";
import {
  checkParticipation,
  register_auction,
  viewAuctionInfo,
} from "@/app/api/apiEndpoints";
import { useEffect } from "react";
import { joinAuctionSession } from "@/app/api/apiEndpoints";
import { socket } from "@/app/socket";
import { Label } from "@/components/ui/label";
import HistoryBiddingTable from "../_component/HistoryBiddingTable";
import BidderAttedTable from "../_component/BidderAttendTable";
import CompareDate from "@/app/component/function";
export default function CustomerDetail({ params, searchParams }: any) {
  const { toast } = useToast();
  const id = params.id;
  const use_auth = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [infor_auction, set_infor_auction] = useState<any>();
  const [startSession, setStartSession] = useState(false);
  const [onSession, setOnSession] = useState<boolean>();
  const [registered, setRegister] = useState<string>();
  const [autionToken, setAutionToken] = useState<string>();
  const [bidding_history, update_bidding_history] = useState<any>([]);
  const [list_bidder_attend, update_list_bidder_attend] = useState<any>([]);
  const [offer, setOffer] = useState<any>();
  const inputOffer = useRef<any>();
  useEffect(() => {
    const fetchData = async () => {
      const data_get = await viewAuctionInfo(id);
      const data_use = await data_get.data;
      set_infor_auction(data_use);
      if (CompareDate(Date.now(), data_use?.auction_start))
        setStartSession(true);
    };
    const checkStatusParticipation = async () => {
      const checkRegister = await checkParticipation(id);
      const register_use = await checkRegister?.data?.status;
      setRegister(register_use);
    };
    fetchData().catch(console.error);
    checkStatusParticipation().catch(console.error);
  }, []);

  useEffect(() => {
    const getAuctionToken = async (id: any) => {
      const data_use = await joinAuctionSession(id);
      const token: string = await data_use.data.data?.token?.replace(
        "Bearer ",
        ""
      );
      setAutionToken(token);
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

      socket.emit("join_session", autionToken);
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("socket_error");
        socket.off("join_session_response");
        socket.off("attendees_update");
        socket.off("make_offer_response");
        socket.off("biddings_update");
      };
    }
  }, [onSession]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Button
        onClick={() => {
          const hihi = new Date(Date.now());
          console.log(hihi);
          toast({
            title: "Scheduled: Catch up ",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          });
        }}
      >
        Test
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
                <CardTitle>Dat gia</CardTitle>
                <CardContent>
                  <p>Giá cao nhất hiện tại: </p>
                  <p>Giá khởi điểm: {infor_auction?.starting_price} vnd</p>
                  <p>
                    Bước giá tối thiểu: {infor_auction?.bidding_increment} vnd
                  </p>
                  <p>Bạn đang trả giá: {offer}</p>
                  {startSession && (
                    <div>
                      {registered == "VERIFIED" && (
                        <div>
                          {onSession && (
                            <div className="grid grid-cols-4">
                              <Input
                                type="number"
                                className="col-span-3"
                                ref={inputOffer}
                                onChange={(e) => {
                                  setOffer(e.target.value);
                                }}
                              />
                              <Button
                                className="col-span-1"
                                onClick={() => {
                                  console.log(autionToken);

                                  if (onSession) {
                                    socket.emit(
                                      "make_offer",
                                      autionToken,
                                      offer
                                    );
                                  }
                                }}
                              >
                                Trả giá
                              </Button>
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
                      {registered != "VERIFIED" && (
                        <Button className="w-full">
                          Đã quá thời hạn đăng kí tham gia
                        </Button>
                      )}
                    </div>
                  )}
                  {!startSession && (
                    <div>
                      {registered === "NOT_REGISTERED_YET" && (
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button className="col-span-1 w-full">
                              Đăng kí tham gia đấu giá
                            </Button>
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
                                onClick={async (e) => {
                                  const result = await register_auction(
                                    id
                                  ).catch(console.error);
                                  if (result?.status == 200) {
                                    setRegister("NOT_VERIFIED");
                                  }
                                }}
                              >
                                Đồng ý
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {registered === "NOT_VERIFIED" && (
                        <Button disabled className="col-span-1 w-full">
                          Chờ phê duyệt
                        </Button>
                      )}
                      {registered === "VERIFIED" && (
                        <Button disabled className="col-span-1 w-full">
                          Bạn đã đăng ký
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
            <HistoryBiddingTable
              list_bid={bidding_history}
            ></HistoryBiddingTable>
          </TabsContent>
          <TabsContent value="inform">
            <BidderAttedTable
              list_bidder={list_bidder_attend}
            ></BidderAttedTable>
          </TabsContent>
          <TabsContent value="describe">Change your password here.</TabsContent>
          <TabsContent value="document">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CountTime(endTime: any) {}
