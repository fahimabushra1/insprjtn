"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiUser, FiCalendar } from "react-icons/fi";
import { useBlogDetails } from "@/hooks/useBlogs";
import { formatDate } from "@/utils/format";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useBlogDetails(slug);

  const blog = data?.data;

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isError || !blog) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Blog post not found</h2>
        <p className="mt-2 text-muted-foreground">The article you are looking for does not exist or has been removed.</p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.BLOG}>Back to Blogs</Link>
        </Button>
      </div>
    );
  }

  const imageUrl = blog.thumbnail || PLACEHOLDER_IMAGE;

  return (
    <article className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href={ROUTES.BLOG}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <FiArrowLeft />
            Back to Blogs
          </Link>
        </motion.div>

        {/* Title & Meta */}
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-4"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <FiUser className="text-primary" />
              By {blog.author}
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar className="text-primary" />
              {formatDate(blog.createdAt)}
            </span>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative aspect-video overflow-hidden rounded-2xl shadow-md mb-12 border border-emerald-950/10"
        >
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-emerald max-w-none dark:prose-invert"
        >
          {blog.content.split("\n\n").map((paragraph, index) => (
            <p
              key={index}
              className="text-lg leading-relaxed text-muted-foreground mb-6 whitespace-pre-line"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>
      </div>
    </article>
  );
}
