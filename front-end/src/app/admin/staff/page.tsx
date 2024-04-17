import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from 'lucide-react';
import StaffTable from "./_component/StaffTable";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import StaffForm from "./_component/StaffForm";

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
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"createBtn"}>
                <UserPlus />
                <p className="ml-2">Tạo nhân viên</p>
              </Button>
            </DialogTrigger>

            <StaffForm />
          </Dialog>
        </div>
      </div>

      <div>
        <StaffTable />
      </div>
    </div>
  );
}
