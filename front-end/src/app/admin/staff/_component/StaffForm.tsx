"use client"

import { toast, Toaster } from "sonner"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { createStaff } from "@/app/api/apiEndpoints";
import { HTTP_STATUS } from "@/lib/constant/constant";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string(),
    ssid: z.string().min(10, {
        message: "CCCD cần ít nhất 11 số",
    }),
});

export default function StaffForm({ setClose, open }: { setClose: any, open: any }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            ssid: "",
        },
    });

    const router = useRouter();
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const userData = {
            ...values,
        }
        try {
            const res = await createStaff(userData);
            if (res.status === HTTP_STATUS.OK) {
                toast.success("Tạo đấu giá viên thành công", {
                    description: new Date().toLocaleString(),
                });
                router.push(window.location.href);
                router.refresh();
                setClose(false);
            } else {
                toast.error("Tạo nhân viên thất bại", {
                    description: "Kiểm tra lại thông tin",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Tạo nhân viên thất bại", {
                description: "Kiểm tra lại thông tin",
            })
        }
    }

    return (
        <DialogContent className="">
            <DialogHeader>
                <DialogTitle>Tạo đấu giá viên</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Form {...form}>
                    <form className="space-y-3 md:space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ và tên</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nguyễn Văn A" {...field} className="rounded-full" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ssid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CCCD</FormLabel>
                                    <FormControl>
                                        <Input placeholder="23453645768" {...field} className="rounded-full" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" >Tạo đấu giá viên</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </div>
        </DialogContent>
    );
}