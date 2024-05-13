"use client";

import { assetData } from "@/lib/constant/dataInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<assetData>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "verified",
    header: "Status",
  },
];
