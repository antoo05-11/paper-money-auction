"use client"

import { assetData } from "@/lib/constant/dataInterface"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<assetData>[] = [
  {
    accessorKey: "verified",
    header: "Status",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
