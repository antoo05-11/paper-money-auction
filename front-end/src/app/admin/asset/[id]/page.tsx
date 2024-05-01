"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllUser, verifyAsset, viewAsset } from "@/app/api/apiEndpoints";
import { useEffect, useState } from "react";
import { filterUserData, userData } from "@/lib/constant/dataInterface";

const FormSchema = z.object({
  verified: z.boolean().default(true),
  auctioneer: z.string({
    required_error: "Vui lòng chọn 1 đấu giá viên phụ trách.",
  }),
});

export default function CustomerDetail({ params, searchParams }: any) {
  const id = params.id;
  const [infor_asset, set_infor_asset] = useState<any>();
  const [list_autioneer, set_list_auctioneer] = useState<userData[]>();
  // const [verify_asset, set_verify_asset] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const listFisrt = await viewAsset(id);
      // const json = await listFisrt.json()
      const data_asset = await listFisrt.data.data;
      set_infor_asset(data_asset);
    };
    const result = fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);
  useEffect(() => {
    const getListAuctioneer = async () => {
      const response = await getAllUser({
        name: null,
        ssid: null,
        phone: null,
        email: null,
        active: null,
        role: "auctioneer",
        page: undefined,
        limit: undefined,
      });
      const data_use = await response.data.data.listUser;
      console.log(data_use);
      set_list_auctioneer(data_use);
    };
    const result = getListAuctioneer()
      // make sure to catch any error
      .catch(console.error);
  }, []);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    const verify_asset = async () => {
      const res = await verifyAsset(infor_asset?._id, data);
      console.log(res);
    };
    const result = verify_asset().catch(console.error);
    toast({
      title: "You submitted the following values:",
    });
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[80%] top-0 bot-0">
        <Card className="top-0 bot-0">
          <CardHeader>
            <CardTitle>Phê duyệt tài sản</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-7 gap-4">
            <Card className="bg-cyan-400 col-span-4">
              Hinh anh
              <image></image>
            </Card>
            <div className=" col-span-3 gap-4 h-80">
              <Card className=" bg-cyan-400 row-span-4 gap-4 h-80">
                <CardTitle>Phê duyệt tài sản</CardTitle>
                <CardContent>
                  <p>Chủ nhân tài sản: {infor_asset?.owner?.email}</p>
                  <div>
                    {/* <Button className="col-span-1 w-full">Từ chối</Button> */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Phê duyệt
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Tạo phiên đấu giá</DialogTitle>
                          <DialogDescription>
                            Phê duyệt tài sản đủ yêu cầu và phân công đấu giá
                            viên quản lý
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-2/3 space-y-6"
                          >
                            <FormField
                              control={form.control}
                              name="auctioneer"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Đấu giá viên</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chọn đấu giá viên phụ trách" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {list_autioneer?.map(
                                        (auctioneer: any) => {
                                          return (
                                            <SelectItem value={auctioneer?._id}>
                                              {auctioneer?.name}
                                            </SelectItem>
                                          );
                                        }
                                      )}
                                      <SelectItem value="m@example.com">
                                        m@example.com
                                      </SelectItem>
                                      <SelectItem value="m@google.com">
                                        m@google.com
                                      </SelectItem>
                                      <SelectItem value="m@support.com">
                                        m@support.com
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    You can manage email addresses in your{" "}
                                    <Link href="/examples/forms">
                                      email settings
                                    </Link>
                                    .
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit">Phê duyệt</Button>
                          </form>
                        </Form>
                        <DialogFooter></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col"></CardFooter>
        </Card>
        <Tabs>
          <TabsList>
            <TabsTrigger value="describe">Mô tả tài sản</TabsTrigger>
            <TabsTrigger value="document">Tài liệu liên quan</TabsTrigger>
          </TabsList>
          <TabsContent value="describe">{infor_asset?.description}</TabsContent>
          <TabsContent value="document">{infor_asset?.docs}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
