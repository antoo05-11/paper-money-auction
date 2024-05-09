import {
  assetData,
  auctionData,
  auctioneerData,
  userData,
} from "@/lib/constant/dataInterface";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createAuction } from "@/app/api/apiEndpoints";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import React from "react";

export const columns_assets: ColumnDef<any>[] = [
  {
    id: "stt",
    header: () => <div className="flex justify-center items-center"> STT </div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <span> {row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên tài sản",
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "owner",
    header: "Chủ sở hữu",
    cell: ({ row }) => {
      const owner = row.getValue("owner") as any;
      return owner.email ? <div>{owner.email}</div> : <div>{owner.email}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả tài sản",
    cell: ({ row }) => {
      return <div>{row.getValue("description")}</div>;
    },
  },
  {
    accessorKey: "verified",
    header: "Trạng thái",
    cell: ({ row }) => {
      const verified = row.getValue("verified");
      return verified ? <div>Đã phê duyệt</div> : <div>Chưa phê duyệt</div>;
    },
  },
  {
    accessorKey: "create_aution",
    header: " ",
    cell: ({ row }) => {
      return <CreateAuction asset_id={row.getValue("_id")}></CreateAuction>;
    },
  },
];

const CreateAuction: React.FC<{ asset_id: any }> = ({ asset_id }) => {
  const route = useRouter();
  const FormSchema = z.object({
    asset: z.string().default(asset_id?.asset_id),
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
        </DialogContent>
      </Dialog>
    </div>
  );
};
