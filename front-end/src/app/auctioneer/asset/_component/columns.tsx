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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createAuction } from "@/app/api/apiEndpoints";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { HTTP_STATUS } from "@/lib/constant/constant";
import { useToast } from "@/components/ui/use-toast";
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
    accessorKey: "_id",
    header: " ",
    cell: ({ row }) => {
      return <CreateAuction asset_id={row.getValue("_id")}></CreateAuction>;
    },
  },
];

const CreateAuction: React.FC<{ asset_id: any }> = ({ asset_id }) => {
  const { toast } = useToast();
  const route = useRouter();
  const [docs, setDocs] = useState<any>();
  const [openDialog, setOpenDialog] = useState<boolean>();
  const FormSchema = z.object({
    asset: z.string().default(asset_id),
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
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("docs", JSON.stringify(docs));
    const create_auction = async () => {
      const res = await createAuction(formData);
      if (res.status == HTTP_STATUS.OK) {
        setOpenDialog(false);
      } else {
        // toas
      }
    };
    const result = create_auction().catch(console.error);
  }
  return (
    <div>
      <Dialog onOpenChange={setOpenDialog} open={openDialog}>
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

              <FormItem className="grid grid-cols-6 items-center gap-4">
                <FormLabel className="col-span-3">Tài liệu liên quan</FormLabel>
                <FormControl>
                  <Input required className="col-span-3" type="file" />
                </FormControl>
                <FormMessage />
              </FormItem>
              <div className="grid grid-cols-6 items-center gap-4 pt-6">
                <DialogClose className="col-start-5 col-end-5">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Scheduled: Catch up",
                        description: "Friday, February 10, 2023 at 5:57 PM",
                      });
                    }}
                  >
                    Hủy bỏ
                  </Button>
                </DialogClose>
                <Button className="col-start-6 col-end-6" type="submit">
                  Phê duyệt
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
