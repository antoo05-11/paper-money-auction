import {logData} from "@/lib/constant/dataInterface"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<logData>[] = [
    {
        id: "stt",
        header: () => <div className="flex justify-center items-center"> STT </div>,
        cell: ({ row }) => <div className="flex justify-center items-center"><span> {row.index + 1}</span></div >,
    },
    {
        accessorKey: "_id",
        header: "Mã thao tác",
    },
    {
        accessorKey: "activityCode",
        header: "Tên thao tác"
    },
    {
        accessorKey: "subjectId",
        header: "Mã người thực hiện"
    },
    {
        accessorKey: "objectId",
        header: "Mã đối tượng",
    },
    {
        accessorKey: "objectClass",
        header: "Loại đối tượng",
    },
    {
        accessorKey: "status",
        header: () => (
            <div className="flex justify-center items-center">
                Trạng thái
            </div>
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as String;
            const variant = status === "Thành công" ? "default" : "common";
            return (
                <div className="flex justify-center items-center">
                    <Badge variant={variant}>
                        {status}
                    </Badge>
                </div>
            );
        },
    }
]
