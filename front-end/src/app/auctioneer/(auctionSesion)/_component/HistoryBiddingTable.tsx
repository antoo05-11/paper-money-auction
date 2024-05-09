import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
const HistoryBiddingTable = (list_bid: any): ReactNode => {
  // console.log(list_bid?.list_bid.reverse());
  // const listUse = list_bid?.list_bid.reverse();
  return (
    <Table className="justify-center items-center">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">STT</TableHead>
          <TableHead>Bí danh</TableHead>
          <TableHead>Số tiền đấu giá</TableHead>
          <TableHead>Thời gian</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list_bid?.list_bid?.map((bidder: any, index: any) => {
          return (
            <TableRow>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">
                {bidder?.user?.alias}
              </TableCell>
              <TableCell>{bidder?.price}</TableCell>
              <TableCell>{bidder?.createdAt}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
export default HistoryBiddingTable;
