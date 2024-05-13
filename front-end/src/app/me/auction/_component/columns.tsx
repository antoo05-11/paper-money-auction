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
    accessorKey: "registration_open",
    header: "Thời gian mở đăng ký",
    cell: ({ row }) => {
      const time = String(row.getValue("registration_open"));
      let date = new Date(time);
      const formattedDate = `${date.toLocaleTimeString([], {
        hour12: false,
      })} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return <div className="">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "registration_close",
    header: "Thời gian đóng đăng ký",
    cell: ({ row }) => {
      const time = String(row.getValue("registration_close"));
      let date = new Date(time);
      const formattedDate = `${date.toLocaleTimeString([], {
        hour12: false,
      })} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return <div className="">{formattedDate}</div>;
    },
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
    accessorKey: "auction_end",
    header: "Thời gian đóng đấu giá",
    cell: ({ row }) => {
      const time = String(row.getValue("auction_end"));
      let date = new Date(time);
      const formattedDate = `${date.toLocaleTimeString([], {
        hour12: false,
      })} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return <div className="">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionCell,
  },
];
