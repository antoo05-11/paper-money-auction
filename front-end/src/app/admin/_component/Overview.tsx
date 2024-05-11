"use client";

import { LucideIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Layout, UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { getAllUser, listAuction } from "@/app/api/apiEndpoints";

interface StatisticItem {
    icon: LucideIcon;
    title: string;
    value: number | undefined;
    bgColor: string;
    iconColor: string;
}

const StatisticItem = ({ icon: Icon, title, value, bgColor, iconColor }: StatisticItem) => {

    return (
        <div className="w-full md:w-1/2 lg:w-1/4 mt-2 rounded-lg border p-3">
            <div className="flex">
                <div className={`${bgColor} w-1/4 rounded-lg flex items-center justify-center`}>
                    <Icon size={30} className={cn(`${iconColor}`)} />
                </div>
                <div className="ml-2">
                    <div className="text-lg font-bold">{title}</div>
                    <div className="text-xl text-slate-500 dark:text-slate-400">{value}</div>
                </div>
            </div>
        </div>
    );
};

export default function Overview() {
    const [auctioneerCount, setAuctioneerCount] = useState();
    const [customerCount, setCustomerCount] = useState();
    const [auctionCount, setAuctionCount] = useState<number>();

    useEffect(() => {
        const fetchData = async () => {
            const allAuctioneers = await getAllUser({
                sort: undefined,
                name: undefined,
                ssid: undefined,
                phone: undefined,
                email: undefined,
                active: undefined,
                role: "auctioneer",
                page: undefined,
                limit: 1000000000000,
            });
            const allAuctioneersData = allAuctioneers.data.data.listUser;

            const allCustomer = await getAllUser({
                sort: undefined,
                name: undefined,
                ssid: undefined,
                phone: undefined,
                email: undefined,
                active: undefined,
                role: "customer",
                page: undefined,
                limit: 1000000000000,
            });
            const allCustomerData = allCustomer.data.data.listUser;

            const listFirst = await listAuction({
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
                page_size: 100000000
            });
            const data_asset = listFirst.data.auctions;

            setAuctionCount(data_asset.length);
            setAuctioneerCount(allAuctioneersData.length);
            setCustomerCount(allCustomerData.length);
        };

        fetchData();
    }, []);



    return (
        <Card className="shadow">
            <CardHeader>
                <CardTitle>Tổng quan</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap justify-between">
                    <StatisticItem
                        icon={UsersRound}
                        title="Nhân viên"
                        value={auctioneerCount}
                        bgColor="bg-[#ebf9fa]"
                        iconColor="text-[#29bec9]" />
                    <StatisticItem
                        icon={User}
                        title="Người dùng"
                        value={customerCount}
                        bgColor="bg-[#f0f2ff]"
                        iconColor="text-[#3763fb]" />
                    <StatisticItem
                        icon={Layout}
                        title="Số cuộc đấu giá"
                        value={auctionCount}
                        bgColor="bg-[#fff8e7]"
                        iconColor="text-[#fec634]" />
                </div>
            </CardContent>
        </Card>
    );
}