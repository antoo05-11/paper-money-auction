import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="w-[80%]">
          <div className="w-full flex flex-row">
            <Input className="w-full border-b-2 border-t-0 border-r-0 border-l-0 outline-0" />
            <Button>Search</Button>
          </div>
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
      </div>
    </div>
  );
}
