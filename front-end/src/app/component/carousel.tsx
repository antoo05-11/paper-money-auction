"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect } from "react"
import { listAuction } from "../api/apiEndpoints";
import path from "path"
import { useRouter } from "next/navigation"

const FILE_SERVER_URL =
    process.env.FILE_SERVER ||
    "https://muzik-files-server.000webhostapp.com/paper-money-auction-files/asset-docs/";


export default function MyCarousel() {
    const [listItem, setListItem] = useState<any>(null);
    const [totalItem, settotalItem] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listFirst = await listAuction(
                    {
                        asset: null,
                        registration_open: null,
                        registration_close: null,
                        registration_open_sorted: null,
                        registration_close_sorted: null,
                        auction_start: null,
                        auction_end: null,
                        auction_start_sorted: null,
                        auction_end_sorted: null,
                        status: null,
                        page: null,
                        page_size: 10
                    }
                );

                const data_asset = listFirst.data.auctions;
                setListItem(data_asset);
                settotalItem(data_asset.length);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const router = useRouter();
    return (
        <Carousel className="w-11/12">
            <CarouselContent className="-ml-1">
                {listItem?.map((item: any, index: number) => (
                    <CarouselItem key={index} className="pl-3 md:basis-1/2 lg:basis-1/3">
                        <div>
                            <Card className="rounded-lg p-0 bg-card border">
                                <CardContent className="p-0 h-80">
                                    {/* Assuming the first pic is displayed */}
                                    {item.asset.pics.length > 0 && (
                                        <Image
                                            src={`${FILE_SERVER_URL}${item.asset.pics[0]._id}${path.extname(item.asset.pics[0].name)}`}
                                            alt="Image"
                                            width={500}
                                            height={500}
                                            className="rounded-t-lg w-full h-full"
                                        />
                                    )}
                                </CardContent>
                                <CardContent className="mt-5 flex flex-col gap-2">
                                    <h1 className="font-semibold text-2xl">{item.asset.name}</h1>
                                    <p className="text-slate-500 dark:text-slate-400">Giá khởi điểm: {item.starting_price} VNĐ</p>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Mô tả sản phẩm: {item?.asset?.description}
                                    </p>
                                    <Button className="mt-3 w-full" onClick={() => {
                                        router.push("/item/" + item._id)
                                    }}>
                                        Chi tiết
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>

    )
}
