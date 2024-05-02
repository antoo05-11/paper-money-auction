"use client"

import { assetData } from "@/lib/constant/dataInterface"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<assetData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "verified",
    header: "Status",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
]
