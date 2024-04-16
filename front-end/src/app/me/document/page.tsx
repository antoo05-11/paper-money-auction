import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { UserPlus } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Page() {
  return (
    <div className="container">
      <Table>
        <TableCaption>Danh sách khách hàng</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">STT</TableHead>
            <TableHead>Mã khách hàng</TableHead>
            <TableHead>Họ và tên</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead className="text-right">Chi tiết</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>1234567890</TableCell>
            <TableCell className="text-right">
              <Button>Chi tiết</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </div>
  );
}
