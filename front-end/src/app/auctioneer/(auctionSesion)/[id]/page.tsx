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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
import CompareDate from "@/app/component/function";
import { Label } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import path from "path";
import { useRouter } from "next/navigation";

const FILE_SERVER_URL =
  process.env.FILE_SERVER ||
  "https://muzik-files-server.000webhostapp.com/paper-money-auction-files/asset-docs/";

export default function AuctionDetail({ params }: any) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const id = params.id;
  const [infor_auction, set_infor_auction] = useState<any>();
  const [timeSessionAuction, setTimeSessionAuction] = useState(false);
  const [onSession, setOnSession] = useState(false);
  const [list_bidder, update_list_bidder] = useState<any>();
  const [autionToken, setAutionToken] = useState<string>();
  const [list_bidder_attend, update_list_bidder_attend] = useState<any>([]);
  const [bidding_history, update_bidding_history] = useState<any>([]);
  // const timezone = new Date().getTimezoneOffset();
  const timezone = 0;
  useEffect(() => {
    if (infor_auction) {
      setTimeSessionAuction(
        CompareDate(
          Date.now() - timezone * 60 * 1000,
          infor_auction?.auction_start
        ) &&
          !CompareDate(
            Date.now() - timezone * 60 * 1000,
            infor_auction?.auction_end
          )
      );
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      const dataAution = await viewAuctionInfo(id)
        .then((data) => data.data)
        .then((data) => {
          set_infor_auction(data);
        })
        .catch(console.error);
      const dataBidder = await listBidder(id)
        .then((data) => data.data.data)
        .then((data) => update_list_bidder(data))
        .catch(console.error);
    };
    const result = fetchData().catch(console.error);
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
    if (timeSessionAuction && autionToken != undefined) {
      socket.connect();

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("socket_error", (message) => {});
      socket.on("join_session_response", (response) => {
        if (response.code == true) setOnSession(true);
      });
      socket.on("attendees_update", (response) => {
        update_list_bidder_attend(JSON.parse(response));
      });
      socket.on("make_offer_response", (message) => {});
      socket.on("biddings_update", (message) => {
        update_bidding_history(message.reverse());
      });
      socket.on("start_session_response", (message) => {});
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
  }, [autionToken]);
  const handleStartSession = () => {
    setOnSession(true);
    socket.emit("start_session", autionToken);
    socket.emit("join_session", autionToken);
    router.refresh();
  };
  let imageUrl = "";
  if (
    infor_auction &&
    infor_auction.asset?.pics &&
    infor_auction.asset?.pics[0]
  ) {
    imageUrl = `${FILE_SERVER_URL}${infor_auction.asset?.pics[0]._id
      }${path.extname(infor_auction.asset?.pics[0].name)}`;
  }
  return (
    <div className="container">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Phiên đấu giá</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row gap-4">
            <div className="basis-1/3">
              <Image
                src={imageUrl}
                width={300}
                height={200}
                alt=""
                className="w-full rounded "
              />
            </div>
            <div className="basis-2/3">
              {infor_auction?.auction_start &&
                !timeSessionAuction &&
                !CompareDate(Date.now(), infor_auction?.auction_start) && (
                  <Card>
                    <CountTime
                      startTime={infor_auction?.auction_start}
                      endTime={Date.now() - timezone * 60 * 1000}
                      setstate={setTimeSessionAuction}
                      state={timeSessionAuction}
                    />
                    <div className="flex justify-center mb-1">
                      <Label>Thời gian bắt đầu phiên đấu giá còn</Label>
                    </div>
                  </Card>
                )}
              {infor_auction?.auction_end && timeSessionAuction && (
                <Card>
                  <CountTime
                    startTime={infor_auction?.auction_end}
                    endTime={Date.now() - timezone * 60 * 1000}
                    setstate={setTimeSessionAuction}
                    state={timeSessionAuction}
                  />
                  <div className="flex justify-center mb-1">
                    <Label>Thời gian phiên đấu giá còn</Label>
                  </div>
                </Card>
              )}
              <Card className="row-span-4 mt-5">
                <CardContent className="p-4">
                  <p className="font-bold p-2">
                    <text>Giá cao nhất hiện tại:</text>
                    {timeSessionAuction ? (
                      <span className="float-right">
                        {bidding_history[0]?.price} vnd
                      </span>
                    ) : (
                      <span className="float-right">
                        {infor_auction?.winning_bidding?.price} vnd
                      </span>
                    )}
                  </p>
                  <hr></hr>
                  <p className="font-bold p-2">
                    Giá khởi điểm:{" "}
                    <span className="font-normal float-right">
                      {infor_auction?.starting_price} vnd
                    </span>{" "}
                  </p>
                  <hr></hr>
                  <p className="font-bold p-2">
                    Bước giá tối thiểu:{" "}
                    <span className="font-normal  float-right">
                      {" "}
                      {infor_auction?.bidding_increment} vnd
                    </span>
                  </p>
                  <hr></hr>
                  <p className="font-bold p-2">
                    Tiền đặt cọc:{" "}
                    <span className="font-normal  float-right">
                      {" "}
                      {infor_auction?.deposit} vnd
                    </span>
                  </p>
                  <hr></hr>
                  {CompareDate(Date.now(), infor_auction?.auction_end) && (
                    <p className="font-bold p-2">
                      ID người trúng giá:{" "}
                      <span className="font-normal  float-right">
                        {" "}
                        {infor_auction?.winning_bidding?._id}
                      </span>
                    </p>
                  )}
                  <hr></hr>
                  {timeSessionAuction && (
                    <div className="w-full">
                      {!onSession && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
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
                                onClick={() => handleStartSession()}
                              >
                                Bắt đầu
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {onSession && (
                        <Button className="w-full" disabled>
                          Phiên đấu giá đang diễn ra
                        </Button>
                      )}
                    </div>
                  )}
                  {!timeSessionAuction && infor_auction && (
                    <div className="w-full">
                      {!CompareDate(
                        Date.now(),
                        infor_auction?.auction_start
                      ) && (
                        <Button disabled className="w-full">
                          Chưa đến giờ bắt đầu phiên đấu giá
                        </Button>
                      )}
                      {CompareDate(Date.now(), infor_auction?.auction_end) && (
                        <Button disabled className="w-full">
                          Đã kết thúc phiên đấu giá
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
        <Tabs defaultValue="describe">
          <TabsList>
            {timeSessionAuction && (
              <TabsTrigger value="history">Lịch sử đặt giá</TabsTrigger>
            )}
            {!CompareDate(
              Date.now() - timezone * 60 * 1000,
              infor_auction?.auction_end
            ) && (
                <TabsTrigger value="inform">
                  {!timeSessionAuction ? (
                    <text>Phê duyệt tham gia đấu giá</text>
                  ) : (
                    <text>Danh sách người đấu giá</text>
                  )}
                </TabsTrigger>
              )}
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
            {timeSessionAuction && (
              <DataTable
                columns={attendees_bidding}
                data={list_bidder_attend}
                pageCount={0}
              />
            )}
            {CompareDate(
              Date.now() - timezone * 60 * 1000,
              infor_auction?.registration_open
            ) &&
              !CompareDate(
                Date.now() - timezone * 60 * 1000,
                infor_auction?.auction_start
              ) && (
                <DataTable
                  columns={verified_bidder}
                  data={list_bidder}
                  pageCount={1}
                />
              )}
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
  setstate: Function;
  state: any;
}> = ({ startTime, endTime, setstate, state }) => {
  const countRef = useRef<any>(null);
  const DateEnd = new Date(endTime);
  const DateStart = new Date(startTime);
  const [time, setTime] = useState<number>(0);
  useEffect(() => {
    if (startTime && endTime) {
      setTime(
        Math.floor(Math.abs(DateStart.getTime() - DateEnd.getTime()) / 1000)
      );
      countRef.current = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    }
  }, []);
  useEffect(() => {
    if (time < 0) {
      setstate(!state);
    }
  }, [time]);
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
