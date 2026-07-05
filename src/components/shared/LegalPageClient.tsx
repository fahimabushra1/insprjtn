"use client";

import { motion } from "framer-motion";
import { FiClock, FiFileText, FiShield, FiCornerDownRight } from "react-icons/fi";

type LegalPageData = {
  title: string;
  slug: string;
  content: string;
  updatedAt: string;
};

export default function LegalPageClient({ page }: { page: LegalPageData }) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb / Top Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-semibold uppercase tracking-wider">
          <FiShield className="text-emerald-700" />
          <span>Legal Portal</span>
          <FiCornerDownRight className="text-slate-300" />
          <span className="text-slate-800 dark:text-emerald-300">{page.title}</span>
        </div>

        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-emerald-50 rounded-3xl p-8 md:p-12 shadow-sm mb-8 relative overflow-hidden"
        >
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-[0.03] select-none pointer-events-none">
            <FiFileText className="h-96 w-96 text-emerald-950" />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {page.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <FiClock className="text-emerald-700 h-4 w-4" />
            <span>Last Updated: {formatDate(page.updatedAt)}</span>
          </div>
        </motion.div>

        {/* Content Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm prose prose-emerald max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600"
        >
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </motion.div>
      </div>
    </div>
  );
}
