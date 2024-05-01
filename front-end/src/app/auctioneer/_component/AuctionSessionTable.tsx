import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auctionData } from "@/lib/constant/dataInterface";
import { listAuction, listAuctionManaging } from "@/app/api/apiEndpoints";
import { Badge } from "@/components/ui/badge";


export default function AuctionSessionTable({ staffID }: any) {
    const route = useRouter();
    const path_name = usePathname();
    const [listItem, setListItem] = useState<auctionData[]>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await listAuctionManaging({
                    auctioneer_id: staffID
                });
                const res = response.data.auctions;
                setListItem(res)
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, [staffID]);

    const getAuctionStatus = (auction: auctionData) => {
        const currentTime = new Date().getTime();
        const registrationOpenTime = new Date(auction.registration_open!).getTime();
        const auctionStartTime = new Date(auction.auction_start!).getTime();
        const auctionEndTime = new Date(auction.auction_end!).getTime();

        if (currentTime < registrationOpenTime) {
            return <Badge variant={"secondary"}>Chưa mở</Badge>;
        } else if (currentTime >= auctionStartTime && currentTime <= auctionEndTime) {
            return <Badge variant={"common"}>Đang mở</Badge>;
        } else {
            return <Badge variant={"default"}>Đã đóng</Badge>;
        }
    };

    return (
        <div className="w-full">
            <Table>
                <TableCaption>Danh sách phiên đấu giá</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">STT</TableHead>
                        <TableHead>Mã phiên đấu giá</TableHead>
                        <TableHead>Tên tài sản</TableHead>
                        <TableHead>Thời gian mở đăng kí</TableHead>
                        <TableHead>Thời gian kết thúc đăng kí</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-center">Chi tiết</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listItem && (listItem.map((auction, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{auction._id}</TableCell>
                            <TableCell>{auction.asset.name}</TableCell>
                            <TableCell>{auction.registration_open ? new Date(auction.registration_open).toLocaleString() : ''}</TableCell>
                            <TableCell>{auction.registration_close ? new Date(auction.registration_close).toLocaleString() : ''}</TableCell>
                            <TableCell>{getAuctionStatus(auction)}</TableCell>
                            <TableCell className="text-center">
                                <Button variant={"ghost"} className="text-purpleColor" onClick={() => {
                                    route.push(path_name + "/" + auction?._id);
                                }}><Eye /></Button>
                            </TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
        </div>
    );
}
