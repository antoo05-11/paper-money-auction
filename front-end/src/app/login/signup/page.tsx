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
import { createCustomer } from "@/app/api/apiEndpoints";
import { HTTP_STATUS } from "@/lib/constant/constant";
import axios, { AxiosError } from "axios";
import { Separator } from "@/components/ui/separator";
const formSchema = z
  .object({
    email: z
      .string()
      .min(2, {
        message: "Email must be at least 2 characters.",
      })
      .email(),
    password: z.string().min(1, {
      message: "Input field must not be empty",
    }),
    retype: z.string().min(1, {
      message: "Input field must not be empty",
    }),
    name: z.string().min(1, {
      message: "Input field must not be empty",
    }),
    ssid: z.string().min(1, {
      message: "Input field must not be empty",
    }),
    phone: z.string().min(1, {
      message: "Input field must not be empty",
    }),
    address: z.string().min(1, {
      message: "Input field must not be empty",
    }),
  })
  .refine((data) => data.password === data.retype, {
    message: "Passwords don't match",
    path: ["retype"],
  });

export default function RegisterForm() {
  const router = useRouter();
  const [loadingMessage, setLoading] = useState("Đăng kí");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      ssid: "",
      phone: "",
      address: "",
      retype: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userData = {
      email: values.email,
      password: values.password,
      name: values.name,
      ssid: values.ssid,
      phone: values.phone,
      address: values.address,
    };
    setLoading("Loading");
    try {
      await createCustomer(userData).then((res: any) => {
        if (res.status == HTTP_STATUS.OK) {
          setLoading("Thành công");
          setTimeout(() => {
            router.push("/login/signin");
          }, 3000);
        }
      });
    } catch (err) {
      const error = err as Error | AxiosError;
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message);
        setLoading("Đăng kí");
      }
    }
  }
  return (
    <section className="bg-[url(/Shape.jpg)]">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href={"/"}
          className="flex items-center mb-6 text-2xl font-semibold text-white"
        >
          Vua Tiền Tệ
        </Link>
        <div className="w-full bg-card rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đăng kí
            </h1>
            <Form {...form}>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="mail@vuatiente.com"
                              {...field}
                              className=""
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Họ và tên</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Vua Tiền Tệ"
                              {...field}
                              className=""
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Password"
                              {...field}
                              className=""
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="retype"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Confirm Password"
                              {...field}
                              className=""
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="ssid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">CCCD</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="XXXXXXXXXXXX"
                              {...field}
                              className=""
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Số điện thoại
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="XXXXXXXXXXX"
                              {...field}
                              className=""
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Địa chỉ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dong Da, Hanoi"
                            {...field}
                            className=""
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className={`w-full ${
                    loadingMessage == "Thành công" ? "bg-lime-600" : ""
                  }`}
                  disabled={loadingMessage != "Đăng kí"}
                >
                  {loadingMessage}
                </Button>
              </form>
            </Form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Đã có tài khoản
              <Link
                href={"/login/signin"}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                {" "}
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
