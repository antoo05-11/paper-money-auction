// "use client"

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Ban, Undo2, Eye, Pencil } from 'lucide-react';
// import { Badge } from "@/components/ui/badge";

// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";

// import {
//     AlertDialog,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { CustomAlert } from "../../../component/CustomAlert";

// import { getAllUser } from "@/app/api/apiEndpoints";
// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { userData } from "@/lib/constant/dataInterface";

// export default function CustomerTable() {
//     const [listUser, setListUser] = useState<userData[]>();
//     const pathName = usePathname();
//     const route = useRouter();
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await getAllUser({
//                     name: null,
//                     ssid: null,
//                     phone: null,
//                     email: null,
//                     active: null,
//                     role: "customer",
//                     page: undefined,
//                     limit: undefined
//                 });
//                 setListUser(response.data.data.listUser);
//                 console.log(response);
//             } catch (error) {
//                 console.error("Error fetching customer data:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <Card className="shadow">
//             <div className="flex flex-col justify-center items-center my-7 container">
//                 <div className="w-full">
//                     <Table>
//                         <TableCaption>Danh sách khách hàng</TableCaption>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead className="w-[50px]">STT</TableHead>
//                                 <TableHead>Họ và tên</TableHead>
//                                 <TableHead>Email</TableHead>
//                                 <TableHead>Số điện thoại</TableHead>
//                                 <TableHead className="text-center">Trạng thái</TableHead>
//                                 <TableHead className="text-center">Chi tiết</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {listUser && listUser.map((user, index) => (
//                                 <TableRow key={user._id}>
//                                     <TableCell className="font-medium">{index + 1}</TableCell>
//                                     <TableCell>{user.name}</TableCell>
//                                     <TableCell>{user.email}</TableCell>
//                                     <TableCell>{user.phone}</TableCell>
//                                     <TableCell className="text-center">
//                                         <Badge variant={user.active ? "common" : "secondary"}>
//                                             {user.active ? "Hoạt động" : "Đình chỉ"}
//                                         </Badge>
//                                     </TableCell>
//                                     <TableCell className="text-center">
//                                         <Button
//                                             variant={"ghost"}
//                                             className="text-purpleColor"
//                                             onClick={(e) => { route.push(pathName + '/' + user._id) }}
//                                         >
//                                             <Eye />
//                                         </Button>

//                                         <AlertDialog>
//                                             <AlertDialogTrigger asChild>
//                                                 <Button variant={"ghost"} className="text-red-500"><Ban /></Button>
//                                             </AlertDialogTrigger>

//                                             <CustomAlert variant="BAN" />
//                                         </AlertDialog>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>
//             </div>
//         </Card>
//     );
// }