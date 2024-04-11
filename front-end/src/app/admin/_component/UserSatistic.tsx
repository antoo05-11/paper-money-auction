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
        toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    states: {
        hover: {
            filter: { type: 'none' }
        },
        active: {
            filter: { type: 'none' }
        }
    },
    colors: ['#3763fb', '#E26EE5', '#FFB830'],
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

export default function UserStatistic() {
    const [extend, isExtend] = useState(false);
    const chartHeight = extend ? 440 : 205;
    const options = extend ? extendOptions : defaultOptions;
    const data = [
        {
            name: 'series1',
            data: [31, 40, 28, 51, 42, 109, 100]
        },
    ]
    return (
        <Card className="shadow">
            <CardHeader>
                <CardTitle>Người dùng</CardTitle>
            </CardHeader>
            <CardContent>
                {(typeof window !== 'undefined') &&
                    <Chart type="area" options={defaultOptions} series={data} height={chartHeight} />
                }

                {/* <Button onClick={() => { isExtend(!extend); console.log(extend) }} >
                    Chi tiết
                </Button> */}
            </CardContent>
        </Card>
    )
}