import { assetData } from "@/lib/constant/dataInterface"
import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
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
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hoạt động</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={(e) => {
                        route.push(path_name + "/" + asset._id);
                    }}>
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuSeparator />
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export const columns: ColumnDef<assetData>[] = [
    {
        id: "stt",
        header: () => <div className="flex justify-center items-center"> STT </div>,
        cell: ({ row }) => <div className="flex justify-center items-center"><span> {row.index + 1}</span></div >,
    },
    {
        accessorKey: "_id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Tên"
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "verified",
        header: () => (
            <div className="flex justify-center items-center">
                Trạng thái
            </div>
        ),
        cell: ({ row }) => {
            const status = row.getValue("verified") as String;
            const variant = status === "Chưa phê duyệt" ? "default" : "common";
            return (
                <div className="flex justify-center items-center">
                    <Badge variant={variant}>
                        {status}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ActionCell,
    }
]
