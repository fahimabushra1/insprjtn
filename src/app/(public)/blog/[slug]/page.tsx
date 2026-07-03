import { notFound } from "next/navigation";
import { fetchBlogBySlugServer } from "@/services/blog.server";
import { createMetadata, SITE_NAME } from "@/utils/seo";
import BlogDetailsClient from "@/features/blog/BlogDetailsClient";

export const revalidate = 86400; // Cache details for 24 hours (ISR)

export async function generateMetadata({ params }: any) {
  const { slug } = await params;

  try {
    const response = await fetchBlogBySlugServer(slug);
    const blog = response?.data;

    if (!blog) {
      return { title: `Blog Not Found | ${SITE_NAME}` };
    }

    return createMetadata({
      title: blog.title,
      description: blog.content?.slice(0, 150) + "...",
      path: `/blog/${slug}`,
      image: blog.thumbnail,
    });
  } catch {
    return { title: `Blog | ${SITE_NAME}` };
  }
}

export default async function BlogDetailsPage({ params }: any) {
  const { slug } = await params;

  let blog = null;
  try {
    const response = await fetchBlogBySlugServer(slug);
    blog = response?.data;
  } catch {
    blog = null;
  }

  if (!blog) {
    notFound();
  }

  return <BlogDetailsClient blog={blog} />;
}
