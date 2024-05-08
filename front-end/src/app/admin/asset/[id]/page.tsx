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
import Image from "next/image";
import path from "path";

const FILE_SERVER_URL = process.env.FILE_SERVER || "https://muzik-files-server.000webhostapp.com/paper-money-auction-files/asset-docs/"

const FormSchema = z.object({
  verified: z.boolean().default(true),
  auctioneer: z.string({
    required_error: "Vui lòng chọn 1 đấu giá viên phụ trách.",
  }),
});

export default function Page({ params, searchParams }: any) {
  const id = params.id;
  const [infor_asset, set_infor_asset] = useState<any>();
  const [list_autioneer, set_list_auctioneer] = useState<userData[]>();
  // const [verify_asset, set_verify_asset] = useState(false);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const listFisrt = await viewAsset(id);
        // const json = await listFisrt.json()
        const data_asset = await listFisrt.data.data;
        set_infor_asset(data_asset);
      };
      fetchData();
    } catch (error) {
      console.log("Fail to get asset data", error)
    }
  }, [id]);

  useEffect(() => {
    const getListAuctioneer = async () => {
      const response = await getAllUser({
        sort: undefined,
        name: undefined,
        ssid: undefined,
        phone: undefined,
        email: undefined,
        active: true,
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

  const isVerified = infor_asset?.verified;

  let imageUrl = "";
  if (infor_asset && infor_asset.pics && infor_asset.pics[0]) {
    imageUrl = `${FILE_SERVER_URL}${infor_asset.pics[0]._id}${path.extname(infor_asset.pics[0].name)}`;
  }

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>Phê duyệt tài sản</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-row gap-3">
            <div className="basis-1/3">
              <Image
                src={imageUrl}
                alt="Image"
                width={400}
                height={300}
                className="rounded-md"
              />
            </div>
            <div className="basis-2/3">

              <Tabs className="w-full" defaultValue="describe">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="describe">Mô tả tài sản</TabsTrigger>
                  <TabsTrigger value="document">Tài liệu liên quan</TabsTrigger>
                </TabsList>
                <TabsContent value="describe">
                  <p className="font-bold mt-1">Mã tài sản: <span className="font-normal">{infor_asset?._id}</span></p>
                  <p className="font-bold mt-1">Tên tài sản: <span className="font-normal">{infor_asset?.name}</span></p>
                  <p className="font-bold mt-1">Chủ sở hữu: <span className="font-normal">{infor_asset?.owner?.email}</span></p>
                  <p className="font-bold mt-1">Mô tả: <span className="font-normal">{infor_asset?.description}</span></p>
                  <p className="font-bold mt-1">Trạng thái: <span className="font-normal">{infor_asset?.verified ? 'Đã phê duyệt' : 'Chưa phê duyệt'}</span></p>
                  <p className="font-bold mt-1">Đấu giá viên phụ trách: <span className="font-normal">{infor_asset?.auctioneer?.email}</span></p>

                  {infor_asset && !isVerified &&
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-5">
                          Phê duyệt
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Phê duyêt</DialogTitle>
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
                                            <SelectItem value={auctioneer?._id} key={auctioneer?._id}>
                                              {auctioneer?.name}
                                            </SelectItem>
                                          );
                                        }
                                      )}

                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit">Phê duyệt</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  }
                </TabsContent>

                <TabsContent value="document">
                  {infor_asset?.docs.map((doc: { name: string, _id: string }) => (
                    <div key={doc._id} className="underline">
                      <a href={`${FILE_SERVER_URL}/${doc._id}${path.extname(doc.name)}`} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
