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
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect } from "react";
import { useState } from "react";
import { getUserProfileByID, verifyBidder } from "@/app/api/apiEndpoints";
import { HTTP_STATUS } from "@/lib/constant/constant";
const ActionCell: React.FC<{ row: any }> = ({ row }) => {
  const asset = row.original;
  const route = useRouter();
  const path_name = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Chi tiết</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={(e) => {
            route.push(path_name + "/" + asset._id);
          }}
        >
          Xem thông tin
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns_auctions: ColumnDef<any>[] = [
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
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "registration_open",
    header: "Giờ mở đăng kí",
    cell: ({ row }) => {
      const date = row.getValue("registration_open") as Date;
      return (
        <div className="flex justify-center items-center">
          {new Date(date).toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "registration_close",
    header: "Giờ đóng đăng kí",
    cell: ({ row }) => {
      const date = row.getValue("registration_close") as Date;
      return (
        <div className="flex justify-center items-center">
          {new Date(date).toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "auction_start",
    header: "Giờ mở đấu giá",
    cell: ({ row }) => {
      const date = row.getValue("auction_start") as Date;
      return (
        <div className="flex justify-center items-center">
          {new Date(date).toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "auction_end",
    header: "Giờ kết thúc đấu giá",
    cell: ({ row }) => {
      const date = row.getValue("auction_end") as Date;
      return (
        <div className="flex justify-center items-center">
          {new Date(date).toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "detail",
    header: " ",
    cell: ({ row }) => {
      return <ActionCell row={row}></ActionCell>;
    },
  },
];

export const attendees_bidding: ColumnDef<any>[] = [
  {
    accessorKey: "stt",
    header: () => <div className="flex justify-center items-center"> STT </div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <span> {row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "_id",
    header: () => <div className="flex justify-center items-center"> ID </div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          {row.getValue("_id")}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="flex justify-center items-center"> Họ tên </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "alias",
    header: () => (
      <div className="flex justify-center items-center">Bí danh</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          {row.getValue("alias")}
        </div>
      );
    },
  },
];

export const verified_bidder: ColumnDef<any>[] = [
  {
    accessorKey: "stt",
    header: () => <div className="flex justify-center items-center"> STT </div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <span> {row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "bidder",
    header: () => <div className="flex justify-center items-center"> ID </div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          {row.getValue("bidder")}
        </div>
      );
    },
  },
  {
    accessorKey: "alias",
    header: () => (
      <div className="flex justify-center items-center">Bí danh</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          {row.getValue("alias")}
        </div>
      );
    },
  },
  {
    accessorKey: "penalty",
    header: () => (
      <div className="flex justify-center items-center"> Phạt </div>
    ),
    cell: ({ row }) => {
      return row.getValue("penalty") ? (
        <div className="flex justify-center items-center">Có</div>
      ) : (
        <div className="flex justify-center items-center">Không</div>
      );
    },
  },
  {
    accessorKey: "verified",
    header: () => (
      <div className="flex justify-center items-center"> Tham gia </div>
    ),
    cell: ({ row }) => {
      return row.getValue("verified") ? (
        <div className="flex justify-center items-center">Đã duyệt</div>
      ) : (
        <div className="flex justify-center items-center">Chưa duyệt</div>
      );
    },
  },
  {
    accessorKey: "verify",
    header: () => <div className="flex justify-center items-center"></div>,
    cell: ({ row }) => {
      return (
        <VerifyBidder
          auction_id={row.original?.aution}
          bidder_id={row.original?.bidder}
        />
      );
    },
  },
];

const VerifyBidder: React.FC<{ auction_id: any; bidder_id: any }> = ({
  auction_id,
  bidder_id,
}) => {
  const [customer_profile, set_customer_profile] = useState<userData>();
  const [success, setSuccess] = useState<boolean>();
  useEffect(() => {
    const fetchData = async () => {
      await getUserProfileByID(bidder_id)
        .then((data) => data.data.data)
        .then((data) => set_customer_profile(data));
    };
    fetchData().catch(console.error);
  }, []);
  return (
    <Sheet open={success} onOpenChange={setSuccess}>
      <SheetTrigger>
        <Button>Thông tin</Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[700px]">
        <SheetHeader>
          <SheetTitle>Thông tin của người đấu giá</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        {customer_profile && (
          <div className="grid w-full items-center gap-4">
            <div className="grid grid-cols-2 gap-4  ">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  defaultValue={customer_profile?.name || ""}
                  disabled={true}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ssid">CCCD</Label>
                <Input
                  id="ssid"
                  defaultValue={customer_profile?.ssid || ""}
                  disabled={true}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4  ">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  defaultValue={customer_profile?.phone || ""}
                  disabled={true}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue={customer_profile?.email || ""}
                  disabled={true}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Trạng thái</Label>
                {/* <Input id="phone" defaultValue={customer_profile?.active ? 'Hoạt động' : 'Đình chỉ'} disabled className="rounded-full" /> */}
                {/* <Select
                  defaultValue={customer_profile?.active?.toString()}
                  onValueChange={(e) => {
                    handleSuspendUser(e);
                  }}
                >
                  <SelectTrigger className="w-full rounded-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="true">Hoạt động</SelectItem>
                      <SelectItem value="false">Đình chỉ</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select> */}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Xác minh</Label>
                <Input
                  id="email"
                  defaultValue={
                    customer_profile?.verified ? "Đã xác minh" : "Chưa xác minh"
                  }
                  disabled
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="flex justify-center items-center">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                defaultValue={customer_profile?.address || ""}
                disabled={true}
                className="rounded-full"
              />
            </div>
          </div>
        )}
        <SheetFooter>
          <Button
            onClick={() => {
              const verify = async () => {
                await verifyBidder(bidder_id, auction_id)
                  .then((res) => {
                    if (res.status == HTTP_STATUS.OK) {
                      setSuccess(true);
                    }
                  })
                  .catch(console.error);
              };
            }}
          >
            Phê duyệt
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const bidding_act: ColumnDef<any>[] = [
  {
    accessorKey: "stt",
    header: () => <div className="flex justify-center items-center"> STT </div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <span> {row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "alias",
    header: () => (
      <div className="flex justify-center items-center">Bí danh</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          {row.original?.user?.alias}
        </div>
      );
    },
  },
  {
    accessorKey: "penalty",
    header: () => <div className="flex justify-center items-center">Phạt</div>,
    cell: ({ row }) => {
      return row.original?.user?.penalty ? (
        <div className="flex justify-center items-center">Có</div>
      ) : (
        <div className="flex justify-center items-center">Không</div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="flex justify-center items-center">Số tiền đấu giá</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          {row.getValue("price")}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="flex justify-center items-center">Thời gian</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          {row.getValue("createdAt")}
        </div>
      );
    },
  },
];
