"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const defaultOptions = {
    chart: {
        width: 380,
        height: 205,
        parentHeightOffset: 0,
        toolbar: { show: true }
    },
    dataLabels: { enabled: false },
    states: {
        hover: {
            filter: { type: 'true' }
        },
        active: {
            filter: { type: 'none' }
        }
    },
    colors: ['#29bec9', '#fec634', '#FFB830'],
    legend: { show: false },
    xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        tickPlacement: 'on',
        labels: { show: false },
        axisTicks: { show: false },
        axisBorder: { show: false }
    },
    yaxis: {
        show: true,
        tickAmount: 4,
        labels: {
            offsetX: -17,
        }
    }
};

const extendOptions = {
    ...defaultOptions,
};

export default function AuctionStatistic() {
    const [extend, isExtend] = useState(false);
    const chartHeight = extend ? 440 : 205;
    const charWidth = "100%";
    const options = extend ? extendOptions : defaultOptions;
    const data = [
        {
            name: 'Đang diễn ra',
            data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
            name: 'Chưa diễn ra',
            data: [43, 11, 83, 27, 57, 120, 34]
        },
    ]
    return (
        <Card className="shadow">
            <CardHeader>
                <CardTitle>Cuộc đấu giá</CardTitle>
            </CardHeader>
            <CardContent>
                {(typeof window !== 'undefined') &&
                    <Chart type="area" options={defaultOptions} series={data} height={chartHeight} width={charWidth} />
                }
            </CardContent>
        </Card>
    )
}