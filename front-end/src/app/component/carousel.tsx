import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function MyCarousel() {
    return (
        <Carousel className="w-11/12">
            <CarouselContent className="-ml-1">
                {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem key={index} className="pl-3 md:basis-1/2 lg:basis-1/3">
                        <div>
                            <Card className="rounded-lg p-0">
                                <CardContent className="p-0 h-80">
                                    <Image src={"/demoimage.jpg"} alt="Image" width={500} height={500} className="rounded-t-lg w-full h-full" />
                                </CardContent>

                                <CardContent className="mt-5">
                                    <h1 className="font-semibold text-2xl" >Rồng đỏ Macao</h1>
                                    <p>Giá khởi điểm: 30.000 VNĐ</p>
                                    <p>Thời gian đấu giá: 09/05/2024 08:00:00</p>
                                    <Button className="mt-10 bg-highlightColor w-full">Chi tiết</Button>
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
