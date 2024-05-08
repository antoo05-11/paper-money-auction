'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react";
import { toast } from "sonner";
import { createAsset } from "@/app/api/apiEndpoints";
import { HTTP_STATUS } from "@/lib/constant/constant";
import { useRouter } from "next/navigation";


export default function PropertyForm({ setClose, open }: { setClose: any, open: any }) {
    const [uploadPic, setUploadPic] = useState(null);
    const [uploadDoc, setUploadDoc] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [uploadStatus, setStatus] = useState('idle');
    const router = useRouter();

    const handleDocChange = (event: any) => {
        const file = event.target.files[0];
        setUploadDoc(file);
    }
    const handlePicChange = (event: any) => {
        const file = event.target.files[0];
        setUploadPic(file);
    }
    const handleNameChange = (event: any) => {
        const name = event.target.value;
        setName(name);
    }
    const handleDesChange = (event: any) => {
        const des = event.target.value;
        setDescription(des);
    }
    const handleUpload = async () => {
        if (!uploadPic || !uploadDoc) {
            toast.error("Vui lòng upload tất cả các file yêu cầu.")
            return;
        }
        setStatus('loading');
        try {
            const formData = new FormData();
            formData.append('docs', uploadDoc);
            formData.append('pics', uploadPic);
            const data = {
                "name": name,
                "description": description
            };
            formData.append('data', JSON.stringify({
                name: name,
                description: description
            }));
            createAsset(formData).then(res => {
                if (res.status === HTTP_STATUS.OK) {
                    toast.success('Tạo tài sản thành công');
                    setStatus('succeed');
                    setUploadPic(null);
                    setUploadDoc(null);
                    setName('');
                    setDescription('');
                    router.push(window.location.href);
                    router.refresh();
                    setClose(false);
                } else {
                    console.log(res);
                }
            })
        } catch (error: any) {
            console.log('Upload error:', error);
            setStatus('error');
        } finally {
            setTimeout(() => setStatus('idle'), 5000);
        }
    }

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
                    <Input id="name" className="col-span-3 rounded-full" placeholder="Rổng đổ Macao" onChange={handleNameChange} />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Mô tả
                    </Label>
                    <Input id="name" className="col-span-3 rounded-full" placeholder="Rổng rất đẹp" onChange={handleDesChange} />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture" className="text-right">
                        Ảnh
                    </Label>
                    <Input id="name" className="col-span-3 rounded-full" type="file" multiple onChange={handlePicChange} />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture" className="text-right">
                        Tài liệu
                    </Label>
                    <Input id="name" className="col-span-3 rounded-full" type="file" multiple onChange={handleDocChange} />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleUpload} disabled={uploadStatus == 'loading' ? true : false}>Đăng kí</Button>
            </DialogFooter>
        </DialogContent>
    );
}