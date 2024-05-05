"use client"

import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hook/useDebounce";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./_component/columns";
import { filterUserData, userData } from "@/lib/constant/dataInterface";
import { getAllUser } from "@/app/api/apiEndpoints";
import { useEffect, useState } from "react";
import React from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const searchParams = useSearchParams();
  const [listUser, setListUser] = useState<userData[]>([]);

  const columnsMemo = React.useMemo(() => columns, []);

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  const [filter, setFilter] = useState<filterUserData>(
    {
      sort: undefined,
      name: undefined,
      ssid: undefined,
      phone: undefined,
      email: undefined,
      active: undefined,
      role: "customer",
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
  }, [searchParams])

  useEffect(() => {
    setLoading(true);
    getAllUser(debouncedFilter).then(res => {
      const modifiedData = res.data.data.listUser.map((user: userData) => ({
        ...user,
        verified: user.active ? "Hoạt động" : "Đình chỉ"
      }));
      setListUser(modifiedData);
      setPageCount(res.data.data.totalPages);
    }).finally(() => {
      setLoading(false);
    })
  }, [debouncedFilter]);

  return (
    <div className="container">
      <div className="flex justify-between mb-5">
        <div className="flex flex-row">
          <Input
            className="rounded-full leading-none text-gray-800 dark:text-white bg-transparent focus:outline-none shadow"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>
      {<DataTable columns={columnsMemo} data={listUser} pageCount={pageCount} />}
    </div>
  );
}
