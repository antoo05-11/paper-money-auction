'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { requestVerify, verifyUserByCode } from "@/app/api/apiEndpoints";
import { HTTP_STATUS } from "@/lib/constant/constant";
import { useRouter } from "next/navigation";


export default function VerifyAccount({setClose, open}: {setClose: any, open: any}) {
    const [getCode, setStatus] = useState(false);
    const [verifyCode, setCode] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (open) {
            requestVerify().then((res) => {
                if (res.status === HTTP_STATUS.OK) {
                    setStatus(true);
                } else {
                    toast.error("Không thể tạo mã xác minh email. Vui lòng thử lại.");
                }
            });
        }
      }, [open]);

    const handleGetCode = () => {
        requestVerify().then((res) => {
            if (res.status === HTTP_STATUS.OK) {
                setStatus(true);
            } else {
                toast.error("Không thể tạo mã xác minh email. Vui lòng thử lại.");
            }
        });
    }

    const handleCodeInput = (value: string) => {
        setCode(value);
    }

    const sendVerifyCode = () => {
        verifyUserByCode({'code': verifyCode}).then(res => {
            if (res.status === HTTP_STATUS.OK) {
                toast.success("Email đã được xác minh thành công");
                setClose(false);
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            } else {
                toast.error(res.data.message);
            }
        });
    }

    return (
        <DialogContent className="">
            <DialogHeader>
                <DialogTitle>Xác minh email</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center flex-col">
                <span className="mb-5">
                    Please enter the code we&apos;ve just send to your email.
                </span>
                <InputOTP 
                maxLength={6} 
                value={verifyCode} 
                onChange={(value) => handleCodeInput(value)}
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
                <Button variant="link" className="mt-10 text-left self-start" onClick={handleGetCode}>Gửi lại mã</Button>
            </div>
            <DialogFooter>
                <Button onClick={sendVerifyCode}>Xác thực</Button>
            </DialogFooter>
        </DialogContent>
    );
}