"use client";

import { Card, CardContent } from "@/components/ui/card";
import Overview from "../_component/Overview";
import PostStatistic from "../_component/PostStatistic";
import StaffStatistic from "../_component/StaffStatistic";
import UserStatistic from "../_component/UserSatistic";
import StaffTable from "../staff/_component/StaffTable";

export default function AdminPage() {
  return (
    <div className="container ">
      <div className="w-full">
        <Overview />
      </div>

      <div className="w-full flex mt-3">
        <div className="w-4/12 mr-4">
          <StaffStatistic />
        </div>
        <div className="w-4/12">
          <UserStatistic />
        </div>
        <div className="w-4/12 ml-4">
          <PostStatistic />
        </div>
      </div>

      <div className="mt-3">
        <StaffTable />
      </div>
    </div>
  );
}