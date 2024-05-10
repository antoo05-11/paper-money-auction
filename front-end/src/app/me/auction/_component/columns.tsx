"use client"

import { auctionData } from "@/lib/constant/dataInterface"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<auctionData>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "auction_start",
    header: "Thời gian mở đấu giá",
  },
  {
    accessorKey: "verified",
    header: "Status",
  },
  {
    accessorKey: "result",
    header: "Kết quả trả giá",
  },
  {
    header: "Chi tiết",
  },
]
