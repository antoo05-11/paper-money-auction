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
  payDeposit,
  register_auction,
  viewAuctionInfo,
} from "@/app/api/apiEndpoints";
import { useEffect } from "react";
import { joinAuctionSession } from "@/app/api/apiEndpoints";
import { socket } from "@/app/socket";
import { Label } from "@/components/ui/label";
import CompareDate from "@/app/component/function";
import Image from "next/image";
import { DataTable } from "@/components/ui/data-table";
import { attendees_bidding, bidding_act } from "../_component/columns";
import path from "path";

const FILE_SERVER_URL =
  process.env.FILE_SERVER ||
  "https://muzik-files-server.000webhostapp.com/paper-money-auction-files/asset-docs/";

export default function CustomerDetail({ params, searchParams }: any) {
  const { toast } = useToast();
  const id = params.id;
  const use_auth = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [infor_auction, set_infor_auction] = useState<any>();
  const [startSession, setStartSession] = useState(false);
  const [timeRegister, setTimeRegister] = useState<boolean>();
  const [onSession, setOnSession] = useState<boolean>();
  const [registered, setRegister] = useState<string>();
  const [autionToken, setAutionToken] = useState<string>();
  const [bidding_history, update_bidding_history] = useState<any>([]);
  const [list_bidder_attend, update_list_bidder_attend] = useState<any>([]);
  const [offer, setOffer] = useState<any>();
  const inputOffer = useRef<any>();

  let imageUrl = "";
  if (
    infor_auction &&
    infor_auction.asset?.pics &&
    infor_auction.asset?.pics[0]
  ) {
    imageUrl = `${FILE_SERVER_URL}${
      infor_auction.asset?.pics[0]._id
    }${path.extname(infor_auction.asset?.pics[0].name)}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      const data_get = await viewAuctionInfo(id);
      const data_use = await data_get.data;
      set_infor_auction(data_use);
      setStartSession(
        CompareDate(Date.now(), data_use?.auction_start) &&
          !CompareDate(Date.now(), data_use?.auction_end)
      );
      setTimeRegister(
        CompareDate(Date.now(), data_use?.registration_open) &&
          !CompareDate(Date.now(), data_use?.registration_close)
      );
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
      socket.on("withdraw_offer_response", (message) => {
        console.log("withdraw_offer_response");
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
    <div className="pt-24 container">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Phiên đấu giá</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-8 gap-4">
            <div className="col-span-2">
              <Image
                src={imageUrl}
                width={300}
                height={200}
                alt=""
                className="w-full rounded "
              />
            </div>

            <div className=" col-span-3 grid grid-rows-1 gap-4">
              {infor_auction?.auction_start && (
                <>
                  {!startSession && !timeRegister && (
                    <Card>
                      <CountTime
                        startTime={Date.now()}
                        endTime={infor_auction?.auction_start}
                      />
                      <div className="flex justify-center mb-1">
                        <Label>Thời gian đến khi bắt đầu phiên đấu giá</Label>
                      </div>
                    </Card>
                  )}
                </>
              )}
              {startSession && infor_auction?.auction_end && (
                <Card>
                  <CountTime
                    startTime={Date.now()}
                    endTime={infor_auction?.auction_end}
                  />
                  <div>
                    <Label>Thời gian đến khi kết thúc phiên đấu giá</Label>
                  </div>
                </Card>
              )}
              {timeRegister && infor_auction?.registration_close && (
                <Card>
                  <CountTime
                    startTime={Date.now()}
                    endTime={infor_auction?.registration_close}
                  />
                  <div className="flex justify-center mb-1">
                    <Label className="italic">
                      Thời gian đến khi kết thúc phiên đấu giá
                    </Label>
                  </div>
                </Card>
              )}
              <Card className="row-span-4">
                <CardContent className="p-6">
                  <p className="font-bold">Giá cao nhất hiện tại: </p>
                  <p className="font-bold">
                    Giá khởi điểm:{" "}
                    <span className="font-normal">
                      {infor_auction?.starting_price} vnd
                    </span>{" "}
                  </p>
                  <p className="font-bold">
                    Bước giá tối thiểu:{" "}
                    <span className="font-normal">
                      {" "}
                      {infor_auction?.bidding_increment} vnd
                    </span>
                  </p>
                  <p className="font-bold">
                    Tiền đặt cọc:{" "}
                    <span className="font-normal">
                      {" "}
                      {infor_auction?.deposit} vnd
                    </span>
                  </p>
                  <p className="font-bold">Bạn đang trả giá: {offer}</p>
                </CardContent>
              </Card>

              <div>
                {startSession && (
                  <div className="mt-4">
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
                                  socket.emit("make_offer", autionToken, offer);
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
                {!startSession &&
                  !timeRegister &&
                  (registered == "VERIFIED" ? (
                    <Button className="w-full">Đăng ký thành công</Button>
                  ) : registered == "NOT_REGISTERED_YET" ? (
                    <Button className="w-full">
                      Đã quá thời hạn đăng kí tham gia
                    </Button>
                  ) : (
                    <Button className="w-full">Đang chờ phê duyệt</Button>
                  ))}
                {timeRegister && (
                  <div>
                    {registered === "NOT_REGISTERED_YET" && (
                      <AlertDialog>
                        <AlertDialogTrigger className="w-full">
                          <Button className="w-full">
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
                              đấu giá viên và bạn phải đặt cọc số tiền cần thiết
                              để tham gia
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Input placeholder="Nhập mã CCV để hoàn tất đặt cọc và đăng ký" />
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async (e) => {
                                const result = await register_auction(id).catch(
                                  console.error
                                );
                                await payDeposit(
                                  infor_auction?._id,
                                  infor_auction?.deposit
                                );
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
              </div>
            </div>

            <div className="col-span-3">
              <Card className="bottom-0 h-full">
                <CardHeader>
                  <CardTitle className="text-base">Lịch sử đặt giá</CardTitle>
                </CardHeader>
                <CardContent className=" ">
                  <DataTable
                    columns={bidding_act}
                    data={bidding_history}
                    pageCount={1}
                  />
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col"></CardFooter>
        </Card>
        <Tabs defaultValue="describe" className="mb-9">
          <TabsList>
            <TabsTrigger value="history">Lịch sử đặt giá</TabsTrigger>
            <TabsTrigger value="inform">Thông tin đấu giá</TabsTrigger>
            <TabsTrigger value="describe">Mô tả tài sản</TabsTrigger>
            <TabsTrigger value="document">Tài liệu liên quan</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <DataTable
              columns={bidding_act}
              data={bidding_history}
              pageCount={1}
            />
          </TabsContent>
          <TabsContent value="inform">
            <DataTable
              columns={attendees_bidding}
              data={list_bidder_attend}
              pageCount={1}
            />
          </TabsContent>
          <TabsContent value="describe">
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-2xl font-bold">
                    Tên tài sản: {infor_auction?.asset?.name}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Mô tả tài sản: {infor_auction?.asset?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="document">
            <Card>
              <CardContent className="p-6">
                {infor_auction?.asset?.docs.map(
                  (doc: { name: string; _id: string }) => (
                    <div key={doc._id} className="underline">
                      <a
                        href={`${FILE_SERVER_URL}/${doc._id}${path.extname(
                          doc.name
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.name}
                      </a>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </TabsContent>
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
    if (startTime && endTime) {
      console.log(123);
      setTime(
        Math.floor(Math.abs(DateStart.getTime() - DateEnd.getTime()) / 1000)
      );
      countRef.current = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    }
  }, []);
  return (
    <div className="row-span-2 flex flex-row justify-evenly text-center p-3">
      <div>
        <div className="row-span-1 font-bold">Ngày</div>
        <div className="text-2xl">{Math.floor(time / 86400)}</div>
      </div>

      <div>
        <div className="row-span-1 font-bold">Giờ</div>
        <div className="text-2xl">{Math.floor(time / 3600) % 24}</div>
      </div>

      <div>
        <div className="row-span-1 font-bold">Phút</div>
        <div className="text-2xl">{Math.floor(time / 60) % 60}</div>
      </div>

      <div>
        <div className="row-span-1 font-bold">Giây</div>
        <div className="text-2xl">{time % 60}</div>
      </div>
    </div>
  );
};
