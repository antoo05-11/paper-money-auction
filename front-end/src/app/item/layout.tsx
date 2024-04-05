// Import the Client Component into a parent Layout (Server Component)
import BlogNavLink from "./page";
// import getFeaturedPosts from './get-featured-posts'

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {/* {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div> */}
    </div>
  );
}
