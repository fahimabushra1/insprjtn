"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiZoomIn } from "react-icons/fi";
import { useGallery } from "@/hooks/useGallery";
import GallerySkeleton from "@/components/skeletons/GallerySkeleton";
import NoGalleryFound from "@/components/empty-states/NoGalleryFound";

export default function GalleryPage() {
  const [activeItem, setActiveItem] = useState(null);
  const { data, isLoading, isError } = useGallery({ page: 1, limit: 100 });

  const items = data?.data?.items || [];

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
              Photo Gallery
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-4">
              Sundarban in <span className="text-primary">Pictures</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Take a visual journey through the winding streams, exotic wildlife, and lush green mangroves.
            </p>
          </motion.div>
        </div>

        {/* Gallery Content */}
        {isLoading ? (
          <GallerySkeleton />
        ) : isError ? (
          <div className="py-12 text-center text-destructive">
            Failed to load gallery items. Please try again later.
          </div>
        ) : items.length === 0 ? (
          <NoGalleryFound />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {items.map((item) => (
              <motion.div
                key={item._id}
                layoutId={`gallery-item-${item._id}`}
                onClick={() => setActiveItem(item)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-950/10 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      className="rounded-full bg-white/20 p-3 backdrop-blur-sm text-white"
                    >
                      <FiZoomIn className="h-6 w-6" />
                    </motion.div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox / Dialog Popup */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>

            <motion.div
              layoutId={`gallery-item-${activeItem._id}`}
              className="relative max-w-4xl max-h-[85vh] w-full overflow-hidden rounded-2xl bg-black flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-video md:aspect-[16/10] max-h-[70vh]">
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
              <div className="w-full bg-emerald-950/80 p-5 text-white backdrop-blur-md">
                <h2 className="text-xl font-bold tracking-tight">{activeItem.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
