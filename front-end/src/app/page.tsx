"use client";
import PageHeader from "./component/page-header";
import PageFooter from "./component/page-footer";
import Image from "next/image";
import MyCarousel from "./component/carousel";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function HomePage() {
  const assetSectionRef = useRef<null | HTMLDivElement>(null);
  const executeScroll = () => {
    assetSectionRef.current!.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.scrollBy(0, -70);
  };

  return (
    <div className="bg-bgColor bg-[url(/bg.png)] bg-cover">
      {/* === Banner === */}
      <div className="bg-[url(/hero-header-bg.png)] bg-cover center h-screen">
        <PageHeader />
        <div className="container flex flex-row h-full">
          <div className="basis-1/2 flex-row content-center pl-4">
            <h3 className="font-semibold text-2xl mb-1.5 text-highlightColor">
              Chào mừng bạn đến với vua tiền tệ{" "}
            </h3>
            <h3 className="font-bold text-3xl mb-1.5">
              Nền tảng đấu giá hàng đầu Việt Nam
            </h3>
            <h1 className="font-normal mb-1.5">
              Tự hào là một trong những nền tảng đấu giá trực tuyến hàng đầu tại Việt Nam,
              Vua Tiền Tệ tự hào là đơn vị tiên phong trong việc sử dụng công nghệ thông tin để tối ưu hóa hoạt động đấu giá của mình.
            </h1>
            <Button className="mt-2 bg-highlightColor" onClick={executeScroll}>
              Khám phá
            </Button>
          </div>
          <div className="basis-1/2 content-center">
            <Image
              src={"/hero.png"}
              alt="Logo"
              width={450}
              height={450}
              className="ml-28"
            />
          </div>
        </div>
      </div>

      {/* === Item show === */}
      <div
        className="flex justify-center items-center flex-col pb-10"
        ref={assetSectionRef}
      >
        <div className="my-6">
          <h3 className="font-bold text-2xl text-highlightColor">
            Tài sản sắp được đấu gíá
          </h3>
        </div>
        <MyCarousel />
      </div>

      {/*=== Footer === */}
      <PageFooter />
    </div>
  );
}
