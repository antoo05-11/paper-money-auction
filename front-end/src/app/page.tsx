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
    <div>
      {/* === Banner === */}
      <div className="bg-[url(/home-1-bg-shape.png)] dark:bg-[url(/bachngu1.png)] bg-cover center h-screen">
        <PageHeader />
        <div></div>
        <div className="container flex flex-row h-full">
          <div className="basis-1/2 flex-row content-center pl-4 relative">
            <h3 className="font-bold mb-3 text-3xl text-primary">
              Chào mừng bạn đến với{" "}
            </h3>
            <h1 className="font-extrabold mb-3 text-6xl animate-typing overflow-hidden whitespace-nowrap leading-normal">
              Vua tiền tệ
            </h1>
            <h1 className="font-normal mb-3 text-slate-500 dark:text-slate-400">
              Tự hào là một trong những nền tảng đấu giá trực tuyến hàng đầu tại
              Việt Nam.
            </h1>
            <Button className="mt-2" onClick={executeScroll}>
              Khám phá
            </Button>
            <div className="absolute left-72 -bottom-1 z-10">
              <div className=" animate-floating3">
                <Image src="/shape3.png" width={29} height={29} alt="" />
              </div>
            </div>
            <div className="absolute -bottom-32 ">
              <div className="animate-floating2">
                <Image src="/shape5.png" width={29} height={29} alt="" />
              </div>
            </div>
            <div className="absolute -bottom-32 right-2/3">
              <div className="animate-floating1">
                <Image src="/shape6.png" width={29} height={29} alt="" />
              </div>
            </div>
            <div className="absolute top-1/2 z-10">
              <div className="animate-floating3">
                <Image src="/shape1.png" width={10} height={10} alt="" />
              </div>
            </div>
          </div>
          <div className="basis-1/2 flex items-center justify-center relative">
            <div>
              <div className="relative">
                <Image
                  src={"/hero.png"}
                  alt="Logo"
                  width={350}
                  height={350}
                  className="z-20"
                />
                <div className="absolute top-0 right-20 animate-bid">
                  <Image
                    src={"/bid.png"}
                    alt="Logo"
                    width={80}
                    height={80}
                    className="z-20"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-32 right-24">
              <div className="animate-floating1">
                <Image src="/shape6.png" width={29} height={29} alt="" />
              </div>
              <div className="animate-floating3">
                <Image src="/shape7.png" width={10} height={10} alt="" />
              </div>
              <div className="animate-floating3">
                <Image src="/shape7.png" width={10} height={10} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Item show === */}
      <div className="bg-[url(/home1-bg2.png)] dark:bg-[url(/Shape.png)] bg-cover">
        <div
          className="flex justify-center items-center flex-col pb-10 container"
          ref={assetSectionRef}
        >
          <div className="my-6">
            <h3 className="font-bold text-2xl text-primary">
              Các cuộc đấu giá
            </h3>
          </div>
          <MyCarousel />
        </div>
      </div>

      {/*=== Footer === */}
      <PageFooter />
    </div>
  );
}
