"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import BlogCard from "@/features/blog/BlogCard";
import { ROUTES } from "@/constants/routes";

export default function LatestBlogsSection({ blogs = [] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold">Latest From Our Blog</h2>
            <p className="mt-2 text-muted-foreground">
              Read guides, updates, and stories about Sundarban wildlife and travel
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={ROUTES.BLOG}>
              Read All Articles
              <FiArrowRight className="ml-2" />
            </Link>
          </Button>
        </motion.div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <p>Recent blog posts will appear here once published.</p>
          </div>
        )}
      </div>
    </section>
  );
}
