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
const BidderAttedTable = (list_bidder: any): ReactNode => {
  console.log(list_bidder?.list_bidder);

  return (
    <Table className="justify-center items-center">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">STT</TableHead>
          <TableHead>Tên phiên đấu giá</TableHead>
          <TableHead>Mã phiên đấu giá</TableHead>
          <TableHead>Thời gian bắt đầu đấu giá</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list_bidder?.list_bidder?.map((bidder: any) => {
          return (
            <TableRow>
              <TableCell className="font-medium">1</TableCell>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>
                <Button>Chi tiết</Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
export default BidderAttedTable;
