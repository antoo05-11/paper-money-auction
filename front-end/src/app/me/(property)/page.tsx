"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Upload, UserPlus } from "lucide-react";
import MyPropertyTable from "./_component/MyPropertyTable";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PropertyForm from "./_component/PropertyForm";
import { useAuth } from "@/lib/auth/useAuth";

export default function Page() {
  const auth = useAuth();
  console.log(auth);
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
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"createBtn"}>
                <Upload />
                <p className="ml-2">Đăng kí tài sản đấu giá</p>
              </Button>
            </DialogTrigger>

            <PropertyForm />
          </Dialog>
        </div>
      </div>

      <MyPropertyTable />
    </div>
  );
}
