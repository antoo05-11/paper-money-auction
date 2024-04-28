import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function StaffForm() {
    return (
        <DialogContent className="">
            <DialogHeader>
                <DialogTitle>Tạo đấu giá viên</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Họ và tên
                    </Label>
                    <Input id="name" className="col-span-3 rounded-full" placeholder="Nguyễn Văn A" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ssid" className="text-right">
                        CCCD
                    </Label>
                    <Input id="ssid" className="col-span-3 rounded-full" placeholder="123456789000" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" variant={"createBtn"}>Tạo đấu giá viên</Button>
            </DialogFooter>
        </DialogContent>
    );
}