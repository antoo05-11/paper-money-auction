import {
  assetData,
  auctionData,
  auctioneerData,
  userData,
} from "@/lib/constant/dataInterface";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const ActionCell: React.FC<{ row: any }> = ({ row }) => {
  const asset = row.original;
  const route = useRouter();
  const path_name = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Chi tiết</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={(e) => {
            route.push(path_name + "/" + asset._id);
          }}
        >
          Xem thông tin
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns_auctions: ColumnDef<any>[] = [
  {
    id: "stt",
    header: () => <div className="flex justify-center items-center"> STT </div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <span> {row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "registration_open",
    header: "Giờ mở đăng kí",
    cell: ({ row }) => {
      const date = row.getValue("registration_open") as Date;
      return <div>{new Date(date).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "registration_close",
    header: "Giờ đóng đăng kí",
    cell: ({ row }) => {
      const date = row.getValue("registration_close") as Date;
      return <div>{new Date(date).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "auction_start",
    header: "Giờ mở đấu giá",
    cell: ({ row }) => {
      const date = row.getValue("auction_start") as Date;
      return <div>{new Date(date).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "auction_end",
    header: "Giờ kết thúc đấu giá",
    cell: ({ row }) => {
      const date = row.getValue("auction_end") as Date;
      return <div>{new Date(date).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "detail",
    header: " ",
    cell: ({ row }) => {
      return <ActionCell row={row}></ActionCell>;
    },
  },
];
