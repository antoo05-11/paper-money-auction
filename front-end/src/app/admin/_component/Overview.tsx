"use client";

import { LucideIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Layout, UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatisticItem {
    icon: LucideIcon;
    title: string;
    value: string | number;
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
                    <div className="text-xl">{value}</div>
                </div>
            </div>
        </div>
    );
};

export default function Overview() {
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
                        value="1"
                        bgColor="bg-[#ebf9fa]"
                        iconColor="text-[#29bec9]" />
                    <StatisticItem
                        icon={User}
                        title="Người dùng"
                        value="1"
                        bgColor="bg-[#f0f2ff]"
                        iconColor="text-[#3763fb]" />
                    <StatisticItem
                        icon={Layout}
                        title="Số bài đăng"
                        value="1"
                        bgColor="bg-[#fff8e7]"
                        iconColor="text-[#fec634]" />
                </div>
            </CardContent>
        </Card>
    );
}