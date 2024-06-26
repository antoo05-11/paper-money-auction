"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import {
  loginUser,
  login2FA,
  confirmBid,
  payAuction,
  viewAuctionInfo,
} from "@/app/api/apiEndpoints";
import { HTTP_STATUS, ROLES } from "@/lib/constant/constant";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import axios, { AxiosError } from "axios";
import { User, confirmAuction } from "@/lib/constant/dataInterface";
export default function ConfirmAuctionPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirm] = useState(false);
  const [auction, setAuction] = useState<any>();
  const [message, setMessage] = useState(
    "Vui lòng xác nhận việc trúng đấu giá của bạn"
  );
  const pathname = usePathname();
  const regexConfirm = new RegExp("item/([^/]+)/(.*)");
  const pathRegex = pathname.match(regexConfirm);
  const auctionId = pathRegex ? pathRegex[1] : null;
  const token = pathRegex ? pathRegex[2] : null;

  function goToAuctionDetail() {
    setTimeout(() => {
      router.push(`/item/${auctionId}`);
    }, 1000);
  }

  useEffect(() => {
    if (auctionId) {
      const auctionInfo = viewAuctionInfo(auctionId).then((res) => {
        setAuction(res.data);
      });
    }
  }, []);

  async function onConfirm(confirm: boolean) {
    setLoading(true);
    if (!auctionId || !token) {
      redirect("/403");
    }
    const newUser: User = {
      name: user?.name ?? "",
      id: user?.id ?? "",
      role: user?.role ?? "",
      isVerified: user?.isVerified ?? false,
      token: token,
    };
    login(newUser);
    try {
      await confirmBid(auctionId, { confirm: confirm }).then((res) => {
        if (res.status == HTTP_STATUS.OK) {
          setMessage(res.data.message);
          setTimeout(() => {
            setConfirm(true);
          }, 1000);
        }
      });
    } catch (err) {
      const error = err as Error | AxiosError;
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message);
        setLoading(false);
      }
    }
    setConfirm(true);
    setLoading(false);
  }
  if (!user) {
    setTimeout(() => {
      redirect("/403");
    }, 2000);
  }
  return (
    <section className="bg-[url(/Shape.jpg)] bg-cover">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href={"/"}
          className="flex items-center mb-6 text-2xl font-semibold text-white"
        >
          Vua Tiền Tệ
        </Link>
        <div
          className="w-full bg-white rounded-lg shadow dark:border 
                          md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 
                          flex flex-col items-center justify-center
                          min-h-52 space-y-4"
        >
          <span>{message}</span>
          <Link href={`/item/${auctionId}`} className="hover:underline">
            ID: {auctionId}
          </Link>
          {!confirmed && (
            <div className="flex flex-row space-x-4">
              <Button onClick={() => onConfirm(false)} disabled={loading}>
                Reject
              </Button>
              <Button onClick={() => onConfirm(true)} disabled={loading}>
                Confirm
              </Button>
            </div>
          )}
          {confirmed && (
            <div className="flex flex-col space-y-4 items-center">
              <Input placeholder="Nhập mã CCV" />
              <Button
                onClick={async (e) => {
                  await payAuction(
                    auctionId,
                    auction.winning_bidding.price
                  ).then((res) => {
                    if (res.status == HTTP_STATUS.OK) {
                      toast.success("Bạn đã thanh toán thành công!");
                      goToAuctionDetail();
                    }
                  });
                }}
                className="w-1/2"
              >
                Thanh toán
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
