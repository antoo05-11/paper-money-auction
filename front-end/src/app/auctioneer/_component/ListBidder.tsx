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
import { useEffect, useState } from "react";
import { listBidder } from "@/app/api/apiEndpoints";
import { useRouter } from "next/navigation";
export default function ListBidder(auction_id: any) {
  const [list_bidder, set_list_bidder] = useState<any>();
  const route = useRouter();
  useEffect(() => {
    const getData = async () => {
      const data_get = await listBidder(auction_id?.auction_id);
      console.log(data_get);
      set_list_bidder(data_get?.data?.data);
    };
    const result = getData()
      // make sure to catch any error
      .catch(console.error);
  }, []);
  return (
    <Table className="justify-center items-center">
      <TableCaption>Danh sánh người tham gia đấu giá</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">STT</TableHead>
          <TableHead>Bí danh</TableHead>
          <TableHead>Thời gian đăng kí</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list_bidder?.map((bidder: any) => {
          return (
            <TableRow>
              <TableCell className="font-medium">1</TableCell>
              <TableCell>{bidder?.alias}</TableCell>
              <TableCell>{bidder?.createdAt}</TableCell>
              <TableCell>
                {bidder?.verified ? "Đã duyệt" : "Chưa duyệt"}
              </TableCell>
              <TableCell>
                <Button onClick={() => {}}>Chi tiết</Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
