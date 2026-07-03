import { fetchBlogsServer } from "@/services/blog.server";
import { createMetadata } from "@/utils/seo";
import BlogListClient from "@/features/blog/BlogListClient";

export const revalidate = 600;

export async function generateMetadata({ searchParams }: any) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = params?.page || "1";

  return createMetadata({
    title: search ? `Search: "${search}" | Travel Blog` : "Sundarban Travel Blog & Guides",
    description: "Read travel stories, checklists, guides, and updates from the Sundarbans forest by Insaniat Parjatan.",
    path: `/blog?page=${page}${search ? `&search=${search}` : ""}`,
  });
}

export default async function BlogPage({ searchParams }: any) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 6;

  let initialData = null;
  try {
    initialData = await fetchBlogsServer({ page, limit, search });
  } catch (error) {
    console.error("Blog page server fetch error:", error);
  }

  const blogs = initialData?.data?.items || [];
  const pagination = initialData?.data?.pagination || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-3">
            Stories & Guides
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-4">
            Our Travel <span className="text-primary">Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Insights, tips, and experiences from our travels through the magnificent Sundarbans.
          </p>
        </div>

        <BlogListClient
          initialBlogs={blogs}
          initialPagination={pagination}
          activeSearch={search}
          activePage={page}
        />
      </div>
    </div>
  );
}
