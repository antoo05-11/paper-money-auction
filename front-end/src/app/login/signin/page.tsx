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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { login, login2FA } from "@/app/api/apiEndpoints";
import { HTTP_STATUS } from "@/lib/constant/constant";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setSessionCookie } from "@/lib/auth/session";
const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string(),
});

export default function LoginForm() {
  type formData = z.infer<typeof formSchema>;
  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const [verifyState, setVerify] = useState(false);
  const [otpValue, setOTP] = useState('');
  const [authData, setAuthData] = useState({ email: '', password: '' });

  const handleOTPInput = (value: string) => {
    setOTP(value);
    if (value.length == 6) {
      setTimeout(() => {
        submit2FACode(value);
    }, 1500);
    }
  }


  async function onSubmit(values: formData) {
    setAuthData(values);
    await login(values).then((res: any) => {
      if (res.status == HTTP_STATUS.OK) {
          setVerify(true);
      }
    })
  }
  async function submit2FACode(value: string) {
    await login2FA({...authData, authenticCode: value}).then((res: any) => {
      if (res.status == HTTP_STATUS.OK) {
        setSessionCookie(res.data.data);
        router.push('/me');
      }
    });

  }
  return (
    <section className="bg-[url(/Shape.jpg)] bg-cover">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href={"/"}
          className="flex items-center mb-6 text-2xl font-semibold text-white"
        >
          Vua Tiền Tệ
        </Link>
        {!verifyState &&
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đăng nhập
            </h1>
            <Form {...form}>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
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
                        <Input placeholder="Password" {...field} className="rounded-full" type="password"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Đăng nhập
                </Button>
              </form>
            </Form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Chưa có tài khoản?
              <Link
                href={"/login/signup"}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                {" "}
                Đăng kí
              </Link>
            </p>
          </div>
        </div>
        }
        {verifyState && 
        <div className="w-full bg-white rounded-lg shadow dark:border 
                        md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 
                        flex flex-col items-center justify-center
                        min-h-52">
          <span>
            Please enter the code we&apos;ve just send to your email.
          </span>
          <InputOTP 
            maxLength={6} 
            value={otpValue} 
            onChange={(value) => handleOTPInput(value)}
            pattern={ REGEXP_ONLY_DIGITS }
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        }
      </div>
    </section>
  );
}
