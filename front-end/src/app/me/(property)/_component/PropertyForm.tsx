import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"


export default function PropertyForm() {
    return (
        <DialogContent className="">
            <DialogHeader>
                <DialogTitle>Đăng kí tài sản đấu giá</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Tên tài sản
                    </Label>
                    <Input id="name" className="col-span-3 rounded-full" placeholder="Rổng đổ Macao" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture" className="text-right">
                        Ảnh
                    </Label>
                    <Input id="name" className="col-span-3 rounded-full" type="file" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture" className="text-right">
                        Tài liệu
                    </Label>
                    <Input id="name" className="col-span-3 rounded-full" type="file" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" variant={"createBtn"}>Đăng kí</Button>
            </DialogFooter>
        </DialogContent>
    );
}