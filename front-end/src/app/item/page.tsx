// "use client";
// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// export default function ListItem() {
//   const [listItem, setListItem] = useState([0, 0, 0, 0, 0, 0]);
//   return (
//     <div>
//       <div className="flex w-full items-center space-x-2 justify-center mt-6">
//         <Input placeholder="Tên sản phẩm" className="w-96" />
//         <Button type="submit">Tìm kiếm</Button>
//       </div>
//       {listItem.map((e) => {
//         return <CardItem />;
//       })}
//       {/* <CardItem /> */}
//     </div>
//   );
// }

// function CardItem() {
//   return (
//     <Card className="bg-red-200 container mb-8 mt-8 max-w-5xl">
//       <CardHeader>
//         <CardTitle>Tên sản phẩm</CardTitle>
//         <CardDescription>Card Description</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p>Hình ảnh sản phẩm</p>
//         <p>Thông tin sản phẩm</p>
//       </CardContent>
//       <CardFooter>
//         <Button>Chi tiết</Button>
//       </CardFooter>
//     </Card>
//   );
// }
"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

// This *client* component will be imported into a blog layout
export default function BlogNavLink({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  // Navigating to `/blog/hello-world` will return 'hello-world'
  // for the selected layout segment
  const segment = useSelectedLayoutSegment();
  const isActive = slug === segment;

  return (
    <Link
      href={`/blog/${slug}`}
      // Change style depending on whether the link is active
      style={{ fontWeight: isActive ? "bold" : "normal" }}
    >
      {children}
    </Link>
  );
}

const ItemListPage = () => {
  return (
    <div>
      <h1>Welcome to my Next.js App!</h1>
    </div>
  );
};

export default ItemListPage;
