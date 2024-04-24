"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createCustomer } from "@/app/api/apiEnpoints";
import { HTTP_STATUS } from "@/lib/constant/constant";
const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
    password: z.string(),
});

export default function RegisterForm() {
    const router = useRouter();
    const [loadingMessage, setLoading] = useState("Đăng kí");
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const userData = {
            ...values,
            name: 'bach',
            ssid: 'wtf',
            phone: '069696969',
            address: 'dofuck'
        }
        await createCustomer(userData).then(res => {
            if (res.status == HTTP_STATUS.OK) {
                setLoading("Thành công");
                setTimeout(() => {
                    router.push('/login/signin');
                }, 3000);
            }
        });
    }
    return (
        <section className="bg-[url(/Shape.jpg)]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link href={"/"} className="flex items-center mb-6 text-2xl font-semibold text-white">
                    Vua Tiền Tệ
                </Link>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Đăng kí
                        </h1>
                        <Form {...form}>
                            <form className="space-y-4 md:space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tài khoản</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tài khoản" {...field} className="rounded-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Password" {...field} className="rounded-full" type="password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className={`w-full ${loadingMessage != 'Đăng kí' ? 'bg-lime-600' : ''}`} disabled={loadingMessage != 'Đăng kí'}>
                                    {loadingMessage}
                                </Button>
                            </form>
                        </Form>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Đã có tài khoản
                            <Link href={"/login/signin"} className="font-medium text-primary-600 hover:underline dark:text-primary-500"> Đăng nhập</Link>
                        </p>

                    </div>
                </div>
            </div>
        </section>
    );
}