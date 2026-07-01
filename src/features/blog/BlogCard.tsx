"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/format";
import { ROUTES } from "@/constants/routes";
import { useLanguage } from "@/providers/LanguageProvider";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80";

export default function BlogCard({ blog }) {
  const { language } = useLanguage();
  const imageUrl = blog.thumbnail || PLACEHOLDER_IMAGE;

  const displayTitle = language === "bn" && blog.titleBn ? blog.titleBn : blog.title;
  const displayContent = language === "bn" && blog.contentBn ? blog.contentBn : blog.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group overflow-hidden border-emerald-950/10 bg-card/65 transition-all hover:shadow-md hover:border-emerald-600/20">
        <Link href={`${ROUTES.BLOG}/${blog.slug}`}>
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-primary/80">By {blog.author}</span>
              <span>•</span>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {displayTitle}
            </h3>
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {displayContent.replace(/<[^>]*>/g, "")}
            </p>
            <div className="pt-2 text-sm font-semibold text-primary group-hover:underline inline-flex items-center gap-1">
              {language === "en" ? "Read More" : "আরও পড়ুন"}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
