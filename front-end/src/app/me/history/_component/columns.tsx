"use client";

import { auctionData } from "@/lib/constant/dataInterface";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

const ActionCell: React.FC<{ row: any }> = ({ row }) => {
  const auction = row.original;

  return (
    <Link
      href={`/item/${auction._id}`}
      className="w-1/2 text-xs hover:underline"
    >
      Chi tiết
    </Link>
  );
};

export const columns: ColumnDef<auctionData>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "asset.name",
    header: "Asset Name",
  },
  {
    accessorKey: "auction_start",
    header: "Thời gian mở đấu giá",
    cell: ({ row }) => {
      const time = String(row.getValue("auction_start"));
      let date = new Date(time);
      const formattedDate = `${date.toLocaleTimeString([], {
        hour12: false,
      })} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return <div className="">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "participation.verified",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const verify = row.getValue("participation.verified");
      let formatted = "Chưa được duyệt tham gia";
      if (verify) {
        formatted = "Đã được tham gia";
      }
      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "result",
    header: "Kết quả trả giá",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionCell,
  },
];
