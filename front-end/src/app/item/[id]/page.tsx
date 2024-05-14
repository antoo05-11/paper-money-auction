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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ROLES } from "@/lib/constant/constant";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useCookie } from "@/lib/auth/useCookie";
const FILE_SERVER_URL =
  process.env.FILE_SERVER ||
  "https://muzik-files-server.000webhostapp.com/paper-money-auction-files/asset-docs/";

export default function CustomerDetail({ params, searchParams }: any) {
  const { toast } = useToast();
  const { user, login } = useAuth();
  const id = params.id;
  const cookie = useCookie();
  const role = JSON.parse(cookie.getSessionCookie())?.role;
  const [isConnected, setIsConnected] = useState(false);
  const [infor_auction, set_infor_auction] = useState<any>();
  const [timeSessionAuction, setTimeSessionAuction] = useState(false);
  const [timeRegister, setTimeRegister] = useState<boolean>();
  const [onSession, setOnSession] = useState<boolean>();
  const [registered, setRegister] = useState<string>("NOT_REGISTERED_YET");
  const [auctionToken, setAuctionToken] = useState<string>();
  const [bidding_history, update_bidding_history] = useState<any>([]);
  const [list_bidder_attend, update_list_bidder_attend] = useState<any>([]);
  const [offer, setOffer] = useState<any>();
  const [offerRes, setOfferRes] = useState<string>();
  const [penalty, setPenalty] = useState<any>(false);
  const [alias, setAlias] = useState<string>();
  const [maxOffer, setMaxOffer] = useState<any>(0);
  const route = useRouter();
  const path_name = usePathname();
  let imageUrl = "";
  if (
    infor_auction &&
    infor_auction.asset?.pics &&
    infor_auction.asset?.pics[0]
  ) {
    imageUrl = `${FILE_SERVER_URL}${infor_auction.asset?.pics[0]._id
      }${path.extname(infor_auction.asset?.pics[0].name)}`;
  }
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
      setTimeRegister(
        CompareDate(
          Date.now() - timezone * 60 * 1000,
          infor_auction?.registration_open
        ) &&
        !CompareDate(
          Date.now() - timezone * 60 * 1000,
          infor_auction?.registration_close
        )
      );
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      const data_get = await viewAuctionInfo(id);
      const data_use = await data_get.data;
      set_infor_auction(data_use);
      setTimeRegister(
        CompareDate(
          Date.now() - timezone * 60 * 1000,
          data_use?.registration_open
        ) &&
        !CompareDate(
          Date.now() - timezone * 60 * 1000,
          data_use?.registration_close
        )
      );
      setTimeSessionAuction(
        CompareDate(
          Date.now() - timezone * 60 * 1000,
          data_use?.auction_start
        ) &&
        !CompareDate(Date.now() - timezone * 60 * 1000, data_use?.auction_end)
      );
    };
    const checkStatusParticipation = async () => {
      if (role == ROLES.CUSTOMER) {
        const checkRegister = await checkParticipation(id);
        const register_use = await checkRegister?.data?.status;
        setRegister(register_use);
      }
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
      setAuctionToken(token);
    };
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    const result = getAuctionToken(id).catch(console.error);
    if (timeSessionAuction && auctionToken != undefined) {
      socket.connect();

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("socket_error", (message) => { });
      socket.on("join_session_response", (response) => {
        if (response?.code == true) setOnSession(true);
        else {
          setOnSession(false);
          toast({
            title: "Chưa đến phiên đấu giá",
            description: "Hãy đợi chờ sự bắt đâu của đấu giá viên phụ trách",
          });
        }
        if (response?.joinInfo?.penalty == true) setPenalty(true);
        if (response?.joinInfo?.alias) setAlias(response.joinInfo.alias);
      });
      socket.on("attendees_update", (response) => {
        update_list_bidder_attend(JSON.parse(response));
      });
      socket.on("make_offer_response", (message) => {
        if (message.message) setOfferRes(message.message);
      });
      socket.on("biddings_update", (message) => {
        update_bidding_history(message.reverse());
      });
      if (timeSessionAuction) {
        socket.emit("join_session", auctionToken);
      }
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("socket_error");
        socket.off("join_session_response");
        socket.off("attendees_update");
        socket.off("make_offer_response");
        socket.off("biddings_update");
        socket.off("join_session_response");
      };
    }
  }, [auctionToken]);
  useEffect(() => {
    if (bidding_history) {
      for (let i = 0; i < bidding_history.length; i++) {
        if (bidding_history[i]?.user?.alias == alias) {
          setMaxOffer(bidding_history[i]?.price);
          setOffer(bidding_history[i]?.price);
          break;
        }
      }
    }
  }, [bidding_history]);
  const handleJoinSession = () => {
    socket.emit("join_session", auctionToken);
    route.push(path_name);
  };
  const handleWithdrawOffer = () => {
    setPenalty(true);
    socket.emit("withdraw_offer", auctionToken);
    route.push(path_name);
  };
  return (
    <div className="pt-24 container">

      {!CompareDate(
        infor_auction?.auction_end,
        Date.now() - timezone * 60 * 1000
      ) && (
          <Alert>
            <AlertTitle>Phiên đấu giá đã kết thúc</AlertTitle>
            <AlertDescription>
              <p>
                Nếu bạn là người trúng đấu giá vui lòng kiểm tra email để có thể
                hoàn tất việc thanh toán cũng như nhận tài sản đấu giá
              </p>
              <p>
                Nếu bạn không trúng đấu giá vui lòng kiểm tra email để có thể nhận
                lại khoản tiền đặt cọc cho phiên đấu giá
              </p>
            </AlertDescription>
          </Alert>
        )}
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
                  {!timeSessionAuction &&
                    !timeRegister &&
                    CompareDate(
                      infor_auction?.auction_start,
                      Date.now() - timezone * 60 * 1000
                    ) && (
                      <Card>
                        <CountTime
                          startTime={Date.now() - timezone * 60 * 1000}
                          endTime={infor_auction?.auction_start}
                          setstate={setTimeSessionAuction}
                          state={timeSessionAuction}
                        />
                        <div className="flex justify-center mb-1">
                          <Label className="italic">
                            Thời gian đến khi bắt đầu phiên đấu giá
                          </Label>
                        </div>
                      </Card>
                    )}
                </>
              )}
              {timeSessionAuction && infor_auction?.auction_end && (
                <Card>
                  <CountTime
                    startTime={Date.now() - timezone * 60 * 1000}
                    endTime={infor_auction?.auction_end}
                    setstate={setTimeSessionAuction}
                    state={timeSessionAuction}
                  />
                  <div className="flex justify-center mb-1">
                    <Label className="italic">
                      Thời gian đến khi kết thúc phiên đấu giá
                    </Label>
                  </div>
                </Card>
              )}
              {timeRegister && infor_auction?.registration_close && (
                <Card>
                  <CountTime
                    startTime={Date.now() - timezone * 60 * 1000}
                    endTime={infor_auction?.registration_close}
                    setstate={setTimeRegister}
                    state={timeRegister}
                  />
                  <div className="flex justify-center mb-1">
                    <Label className="italic">
                      Thời gian đến khi kết thúc đăng ký
                    </Label>
                  </div>
                </Card>
              )}
              <Card className="row-span-4">
                <CardContent className="p-4 flex-col flex">
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
                  <p className="font-bold p-2">
                    Bạn đang trả giá:
                    <span className="font-normal  float-right">
                      {" "}
                      {maxOffer} vnd
                    </span>
                  </p>
                  <hr></hr>
                </CardContent>
              </Card>

              <div>
                {timeSessionAuction && (
                  <div className="mt-4">
                    {registered == "VERIFIED" && (
                      <div>
                        {onSession && (
                          <div>
                            {!penalty ? (
                              <div className="grid grid-cols-4">
                                <Input
                                  type="number"
                                  className="col-span-3"
                                  defaultValue={offer}
                                  onChange={(e) => {
                                    setOffer(e.target.value);
                                  }}
                                />
                                <Button
                                  className="col-span-1"
                                  onClick={() => {
                                    if (onSession) {
                                      socket.emit(
                                        "make_offer",
                                        auctionToken,
                                        offer
                                      );
                                    }
                                    if (
                                      offerRes ==
                                      "Your bidding price is not big enough."
                                    ) {
                                      toast({
                                        title: "Lỗi trả giá",
                                        description:
                                          "Giá bạn đưa ra chưa lớn hớn giá cao nhất hiện tại",
                                      });
                                    }
                                    if (
                                      offerRes == "Your bidding is too quick."
                                    ) {
                                      toast({
                                        title: "Lỗi trả giá",
                                        description:
                                          "Bạn trả giá quá nhanh, hãy kiên nhẫn",
                                      });
                                    }
                                  }}
                                >
                                  Trả giá
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger className="w-full col-start-1 col-end-5 mt-3">
                                    {" "}
                                    <Button className="w-full col-start-1 col-end-5 mt-3">
                                      Rút giá
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Bạn có chắc chắn muốn rút giá?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Việc bạn rút giá có thể gây ảnh hưởng
                                        đến cuộc đấu giá và vì vậy tiền cọc của
                                        bạn sẽ không được hoàn trả
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Hủy bỏ
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleWithdrawOffer()}
                                      >
                                        Vẫn rút giá
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ) : (
                              <Button className="w-full" disabled>
                                Bạn đã rút giá
                              </Button>
                            )}
                          </div>
                        )}
                        {!onSession && (
                          <Button
                            className="w-full"
                            onClick={() => {
                              handleJoinSession();
                            }}
                          >
                            Tham gia phiên đấu giá
                          </Button>
                        )}
                      </div>
                    )}
                    {registered != "VERIFIED" && (
                      <Button className="w-full">
                        Đã quá thời hạn đăng kí tham gia {timeSessionAuction}
                      </Button>
                    )}
                  </div>
                )}
                {!timeSessionAuction &&
                  !timeRegister &&
                  CompareDate(
                    infor_auction?.auction_start,
                    Date.now() - timezone * 60 * 1000
                  ) &&
                  !CompareDate(
                    infor_auction?.register_close,
                    Date.now() - timezone * 60 * 1000
                  ) &&
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
                                if (result?.status == 200) {
                                  await payDeposit(
                                    infor_auction?._id,
                                    infor_auction?.deposit
                                  );
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
            {timeSessionAuction && (
              <TabsTrigger value="inform">Danh sách người đấu giá</TabsTrigger>
            )}
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
  setstate: Function;
  state: any;
}> = ({ startTime, endTime, setstate, state }) => {
  const countRef = useRef<any>(null);
  const DateEnd = new Date(endTime);
  const route = useRouter();
  const pathName = usePathname();
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
