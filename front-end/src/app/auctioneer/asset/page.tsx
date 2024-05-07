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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { listAsset } from "@/app/api/apiEndpoints";
import { auctionData, filterAssetData } from "@/lib/constant/dataInterface";
import { list } from "postcss";
import { usePathname, useRouter } from "next/navigation";
import { createAuction } from "@/app/api/apiEndpoints";
import { toast } from "sonner";

export default function Page() {
  const [list_asset, setListAsset] = useState<any>(null);
  const [param, setParam] = useState<filterAssetData>();
  const route = useRouter();
  const path_name = usePathname();
  useEffect(() => {
    let input: any = null;
    const fetchData = async () => {
      const data_get = await listAsset(input);
      // const json = await data_get.json()
      const data_asset = await data_get.data.data.assets;
      console.log(data_asset);
      setListAsset(data_asset);
    };
    const result = fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="w-[80%]">
          <div className="w-full flex flex-row">
            <Input className="w-full border-b-2 border-t-0 border-r-0 border-l-0 outline-0" />
            <Button>Search</Button>
          </div>
          <Table>
            <TableCaption>Danh sách tài sản</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">STT</TableHead>
                <TableHead>Tên tài sản</TableHead>
                <TableHead>Chủ nhân tài sản</TableHead>
                <TableHead>Mô tả tài sản</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list_asset?.map((data: any) => {
                return (
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>{data?.name}</TableCell>
                    <TableCell>{data?.owner?.email}</TableCell>
                    <TableCell>{data?.description}</TableCell>
                    <TableCell>
                      {data?.verified ? "Chưa tạo phiên đấu giá" : "Đã tạo"}
                    </TableCell>
                    <TableCell className="text-right">
                      <CreateAuction asset_infor={data}></CreateAuction>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function CreateAuction(asset_infor: any) {
  const route = useRouter();
  const FormSchema = z.object({
    asset: z.string().default(asset_infor?.asset_infor?._id),
    starting_price: z.string(),
    bidding_increment: z.string(),
    deposit: z.string(),
    registration_open: z.string(),
    registration_close: z.string(),
    auction_start: z.string(),
    auction_end: z.string(),
    max_number_of_bidder: z.string(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const create_auction = async () => {
      const res = await createAuction(data);
      if (res.status == 200) {
        console.log(123);
      }
    };
    const result = create_auction().catch(console.error);
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Tạo phiên đấu giá</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Tạo phiên đấu giá</DialogTitle>
            <DialogDescription>
              Tạo phiên đấu giá sau khi đã thảo luận với chủ tài sản. Nhấn tạo
              để tạo phiên đấu giá
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
              <FormField
                control={form.control}
                name="starting_price"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="col-span-3">Giá khởi điểm</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bidding_increment"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="col-span-3">
                      Bước giá tối thiểu
                    </FormLabel>
                    <FormControl>
                      <Input
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="col-span-3">
                      Bước giá tối thiểu
                    </FormLabel>
                    <FormControl>
                      <Input
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registration_open"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="col-span-3">
                      Thời gian mở đăng ký
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-3"
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registration_close"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="col-span-3">
                      Thời gian đóng đăng ký
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-3"
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="auction_start"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="col-span-3">
                      Thời gian bắt đầu phiên đấu giá
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-3"
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="auction_end"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="col-span-3">
                      Thời gian kết thúc phiên đấu giá
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-3"
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_number_of_bidder"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="col-span-3">
                      Số lượng người dùng tham gia đấu giá
                    </FormLabel>
                    <FormControl>
                      <Input
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Phê duyệt</Button>
            </form>
          </Form>

          {/* <DialogFooter>
            <Button type="submit">Tạo</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
