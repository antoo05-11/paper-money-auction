import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function MyCarousel() {
    return (
        <Carousel className="w-10/12 ">
            <CarouselContent className="-ml-1">
                {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card className="rounded-3xl">
                                <CardHeader className="flex justify-center items-center">
                                    <CardDescription className="">Thời gian đấu giá</CardDescription>
                                    <CardTitle className="font-medium text-lg">24/11/2003 09:00:00</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center items-center ">
                                    <Image src={"/demoimage.jpg"} alt="Image" width={300} height={300} className="rounded-md" />
                                </CardContent>
                                <CardContent>
                                    <h3 className="font-semibold">Rồng đỏ Macao</h3>
                                    <p>Giá khởi điểm: 30.000 VNĐ</p>
                                    <Button className="mt-2 bg-highlightColor w-full">Chi tiết</Button>
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
