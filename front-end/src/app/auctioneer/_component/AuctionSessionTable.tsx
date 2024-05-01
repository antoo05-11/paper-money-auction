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

export default function AuctionSessionTable(list_aution: any) {
  const route = useRouter();
  const path_name = usePathname();
  return (
    <div className="w-full">
      <Table>
        <TableCaption>Danh sách phiên đấu giá</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">STT</TableHead>
            <TableHead>Tên tài sản</TableHead>
            <TableHead>Thời gian đăng kí</TableHead>
            <TableHead>Thời gian diễn ra</TableHead>
            <TableHead className="text-center">Chi tiết</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list_aution?.list_auction?.map((auction: any) => {
            return (
              <TableRow key={auction?._id}>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>{auction?.asset?.name}</TableCell>
                <TableCell>10/04/2024 08:00:00</TableCell>
                <TableCell>19/04/2024 17:00:00</TableCell>
                {/* <TableCell>22.623.000.000 VNĐ</TableCell> */}
                {/* <TableCell>22.623.000.000 VNĐ</TableCell> */}
                <TableCell className="text-center">
                  <Button
                    variant={"ghost"}
                    className="text-purpleColor"
                    onClick={() => {
                      route.push(path_name + "/" + auction?._id);
                    }}
                  >
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
