// Import the Client Component into a parent Layout (Server Component)
import TopBar from "@/components/_layout/topbar";
import BlogNavLink from "./page";
import PageHeader from "../component/page-header";
import PageFooter from "../component/page-footer";
// import getFeaturedPosts from './get-featured-posts'

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const featuredPosts = await getFeaturedPosts()
  return (
    <div className="bg-[url(/demo.png)] dark:bg-[url(/Shape.png)] bg-cover">
      {/* <PageHeader /> */}
      {children}
      {/* <PageFooter /> */}
    </div>
  );
}
