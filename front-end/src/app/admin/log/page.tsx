"use client";

import {Input} from "@/components/ui/input";
import {DataTable} from "@/components/ui/data-table";
import {useEffect, useState, useMemo} from "react";
import {filterLogData, logData} from "@/lib/constant/dataInterface";
import {useSearchParams} from "next/navigation";
import {useDebounce} from "@/lib/hook/useDebounce";
import {listActivityLog, listAsset} from "@/app/api/apiEndpoints";
import {Button} from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Filter} from "lucide-react";
import {columns} from "./_component/columns";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useRouter, usePathname} from 'next/navigation'

interface CodeMap {
    [key: string]: string;
}

const ACTIVITY_CODE_MAP: CodeMap = {
    'CREATE_AUCTION': 'Tạo phiên đấu giá',
    'UPDATE_AUCTION': 'Cập nhật phiên đấu giá',
    'GET_AUCTION_BY_ID': 'Lấy dữ liệu đấu giá từ mã phiên',
    'GET_AUCTION_LIST': 'Lấy danh sách đấu giá',
    'REGISTER_AUCTION': 'Đăng ký tham gia đấu giá',
    'GET_AUCTION_ACTIVITY_LIST': 'Lấy danh sách hoạt động của phiên đấu giá',
    'GET_AUCTION_BIDDER_LIST': 'Lấy danh sách người tham gia đấu giá',
    'VERIFY_BIDDER_PARTICIPATION': 'Xác nhận người tham gia đấu giá',
    'JOIN_AUCTION_SESSION': 'Tham gia phiên đấu giá',
    'GET_PARTICIPATION_STATUS': 'Lấy trạng thái tham gia',
    'CREATE_ASSET': 'Tạo tài sản',
    'UPDATE_ASSET': 'Cập nhật thông tin tài sản',
    'GET_ASSET_BY_ID': 'Lấy thông tin tài sản qua mã tài sản',
    'GET_ASSET_LIST': 'Lấy danh sách tài sản',
    'VERIFY_ASSET': 'Xác minh tài sản',
    'undefined': 'Không xác định'
};

const OBJECT_CLASS_MAP: CodeMap = {
    'auction': 'Phiên đấu giá',
    'asset': 'Tài sản'
}


export default function Page() {
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const searchParams = useSearchParams();
    const [listLog, setListLog] = useState<logData[]>([]);
    const [filterSuccess, setFilterSuccess] = useState(true);
    const [filterNotSuccess, setFilterNotSuccess] = useState(true);
    const router = useRouter();
    const pathName = usePathname();

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const columnsMemo = useMemo(() => columns, []);

    const [filter, setFilter] = useState<filterLogData>(
        {
            user: undefined,
            success: undefined,
            page: page,
            limit: limit,
        }
    );

    const debouncedFilter = useDebounce(filter, 1000);

    useEffect(() => {
        setFilter(prevFilter => ({
            ...prevFilter,
            page: page,
            limit: limit
        }))
    }, [searchParams, limit, page])

    useEffect(() => {
        setFilter(prevFilter => ({
            ...prevFilter,
            success: handleFilterVerified(filterSuccess, filterNotSuccess),
        }))
    }, [filterSuccess, filterNotSuccess]);

    useEffect(() => {
        setLoading(true);
        listActivityLog(debouncedFilter).then(res => {

            // @ts-ignore
            const modifiedData = res.data.activities.map((log: logData) => ({
                ...log,
                subjectName: log.subject?.name || 'Không xác định',
                activityCode: ACTIVITY_CODE_MAP[log.activityCode],
                rootObjectClass: log.objectClass,
                objectClass: OBJECT_CLASS_MAP[log.objectClass],
                success: log.success ? "Thành công" : "Thất bại"
            }));
            setListLog(modifiedData);
            setPageCount(res.data.totalPages);
        }).finally(() => {
            setLoading(false);
        })
    }, [debouncedFilter, searchParams]);

    const handleFilterVerified = (isVerified: any, isNotVerified: any) => {
        if (isVerified && isNotVerified) {
            return undefined;
        } else if (isVerified && !isNotVerified) {
            return true;
        } else if (!isVerified && isNotVerified) {
            return false;
        }
    };

    return (
        <div className="container">
            <div className="flex justify-between mb-5">
                <div className="flex flex-row">
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    <Filter/>
                                    <span>Bộ lọc</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 ml-40">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Bộ lọc</h4>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className=" items-center gap-4">
                                            <Input
                                                id="width"
                                                placeholder="Lọc theo người thực hiện"
                                                className="h-8"
                                                defaultValue={""}
                                                onChange={(e) => {
                                                    setFilter(prevFilter => ({
                                                        ...prevFilter,
                                                        user: e.target.value,
                                                    }));
                                                    router.push(`${pathName}/?page=1&limit=10`);
                                                }}
                                            />
                                        </div>
                                        <div className="items-center gap-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline"
                                                            className="rounded-lg w-full justify-start">Trạng
                                                        thái</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <DropdownMenuCheckboxItem
                                                        checked={filterSuccess}
                                                        onCheckedChange={setFilterSuccess}
                                                    >
                                                        Thành công
                                                    </DropdownMenuCheckboxItem>

                                                    <DropdownMenuCheckboxItem
                                                        checked={filterNotSuccess}
                                                        onCheckedChange={setFilterNotSuccess}
                                                    >
                                                        Thất bại
                                                    </DropdownMenuCheckboxItem>

                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {<DataTable columns={columnsMemo} data={listLog} pageCount={pageCount}/>}
        </div>
    );
}
