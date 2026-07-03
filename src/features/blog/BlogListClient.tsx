"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BlogCard from "@/features/blog/BlogCard";
import NoBlogsFound from "@/components/empty-states/NoBlogsFound";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Blog {
  _id: string;
  title: string;
  titleBn?: string;
  slug: string;
  content: string;
  contentBn?: string;
  thumbnail: string;
  author: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

interface BlogListClientProps {
  initialBlogs: Blog[];
  initialPagination: Pagination;
  activeSearch: string;
  activePage: number;
}

export default function BlogListClient({
  initialBlogs,
  initialPagination,
  activeSearch,
  activePage,
}: BlogListClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState(activeSearch);
  const [isPending, startTransition] = useTransition();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) {
      params.set("search", search);
    }
    // reset to page 1 on search
    params.set("page", "1");
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (search) {
      params.set("search", search);
    }
    params.set("page", newPage.toString());
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-12">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="mx-auto max-w-md">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search articles, topics or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 w-full bg-white text-slate-900 border-slate-200 focus-visible:ring-emerald-600 rounded-full"
          />
        </div>
      </form>

      {/* Grid listing */}
      {isPending ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-96 bg-slate-100 rounded-2xl border" />
          ))}
        </div>
      ) : initialBlogs.length === 0 ? (
        <NoBlogsFound />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initialBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          {initialPagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                disabled={activePage === 1}
                className="border-slate-200 text-slate-700 bg-white"
              >
                <FiChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium text-slate-500">
                Page {activePage} of {initialPagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.min(initialPagination.totalPages, activePage + 1))}
                disabled={activePage === initialPagination.totalPages}
                className="border-slate-200 text-slate-700 bg-white"
              >
                <FiChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
