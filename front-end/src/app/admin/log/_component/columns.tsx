import {logData} from "@/lib/constant/dataInterface"
import {ColumnDef} from "@tanstack/react-table"
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

interface CodeMap {
    [key: string]: string;
}

const OBJECT_PATH_MAP: CodeMap = {
    'asset': '/admin/asset',
    'auction': '/item',
    'customer': '/admin/customer',
    'auctioneer': '/admin/staff'
}

const ObjectCell: React.FC<{ row: any }> = ({row}) => {
    const objectId = row.original.objectId;
    const rootObjectClass = row.original.rootObjectClass;

    const route = useRouter();
    return <div className="flex justify-center items-center">
        <Button variant={'outline'} onClick={(e) => {
            if (objectId)
                route.push(OBJECT_PATH_MAP[rootObjectClass] + "/" + objectId);
        }}>
            {row.getValue("objectClass") as String}
        </Button>
    </div>;
};
const SubjectCell: React.FC<{ row: any }> = ({row}) => {

    const route = useRouter();
    const subjectId = row.original.subjectId;
    if (subjectId) {
        var role = row.original.subject.role;
    }
    return <div className="flex justify-center items-center">
        <Button variant={'outline'} onClick={(e) => {
            if (role !== 'admin' && subjectId) route.push(OBJECT_PATH_MAP[role] + "/" + subjectId);
        }}>
            {row.original.subjectName}
        </Button>
    </div>;
};
const TimeCell: React.FC<{ row: any }> = ({row}) => {
    const time = row.original.createdAt;
    let date = new Date(time);

    let day: string | number = date.getDate();
    let month: string | number = date.getMonth() + 1;
    let year = date.getFullYear();

    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    let formattedDate = `${hours}h${minutes} : ${day}/${month}/${year}`; // 10h44 : 10/05/2024

    return <div className="flex justify-center items-center">
        {formattedDate}
    </div>;
};

export const columns: ColumnDef<logData>[] = [
    {
        id: "stt",
        header: () => <div className="flex justify-center items-center"> STT </div>,
        cell: ({row}) => <div className="flex justify-center items-center"><span> {row.index + 1}</span></div>,
    },
    {
        accessorKey: "activityCode",
        header: () => (
            <div className="flex justify-center items-center">
                Tên thao tác
            </div>
        ),
        cell: ({row}) => <div className="flex justify-center items-center"><span> {row.original.activityCode}</span>
        </div>,
    },
    {
        accessorKey: "subjectName",
        header: () => (
            <div className="flex justify-center items-center">
                Người thực hiện
            </div>
        ),
        cell: SubjectCell
    },
    {
        accessorKey: "objectClass",
        header: () => (
            <div className="flex justify-center items-center">
                Đối tượng
            </div>
        ),
        cell: ObjectCell
    },
    {
        accessorKey: "createdAt",
        header: () => (
            <div className="flex justify-center items-center">
                Thời gian
            </div>
        ),
        cell: TimeCell
    },
    {
        accessorKey: "success",
        header: () => (
            <div className="flex justify-center items-center">
                Trạng thái
            </div>
        ),
        cell: ({row}) => {
            const status = row.getValue("success") as String;
            const variant = status === "Thành công" ? "success" : "destructive";
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
