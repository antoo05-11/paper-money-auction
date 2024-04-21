import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { UserPlus } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import HistoryTable from "./_component/HistoryTable";

export default function Page() {
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
      <HistoryTable />
    </div>
  );
}
