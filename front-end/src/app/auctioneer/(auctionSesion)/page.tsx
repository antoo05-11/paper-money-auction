"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AuctionSessionTable from "../_component/AuctionSessionTable";
import AuctionSessionForm from "../_component/AuctionSessionForm";
import { Card } from "@/components/ui/card";

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
                                <p className="ml-2">Tạo phiên đấu giá</p>
                            </Button>
                        </DialogTrigger>

                        <AuctionSessionForm />
                    </Dialog>
                </div>
            </div>
            <Card className="shadow">
                <div className="flex flex-col justify-center items-center my-7 container">
                    <AuctionSessionTable />
                </div>
            </Card>
        </div>
    );
}