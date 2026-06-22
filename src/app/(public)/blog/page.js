"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useBlogs } from "@/hooks/useBlogs";
import BlogCard from "@/features/blog/BlogCard";
import BlogCardSkeleton from "@/components/skeletons/BlogCardSkeleton";
import NoBlogsFound from "@/components/empty-states/NoBlogsFound";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError } = useBlogs({
    page,
    limit,
    search,
  });

  const blogs = data?.data?.items || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1 };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-3">
              Stories & Guides
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-4">
              Our Travel <span className="text-primary">Blog</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Insights, tips, and experiences from our travels through the magnificent Sundarbans.
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mx-auto max-w-md mb-12">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search articles, topics or authors..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 h-12 w-full bg-card shadow-sm border-emerald-950/10 focus-visible:ring-emerald-600"
            />
          </div>
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-destructive">
            Failed to load blog posts. Please try again later.
          </div>
        ) : blogs.length === 0 ? (
          <NoBlogsFound />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-emerald-950/10"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="border-emerald-950/10"
                >
                  <FiChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
