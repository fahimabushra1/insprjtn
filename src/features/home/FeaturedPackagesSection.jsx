"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import PackageGrid from "@/features/packages/PackageGrid";
import { ROUTES } from "@/constants/routes";

export default function FeaturedPackagesSection({ packages = [] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold">Featured Tours</h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked Sundarban experiences for every adventurer
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={ROUTES.PACKAGES}>
              View All
              <FiArrowRight className="ml-2" />
            </Link>
          </Button>
        </motion.div>

        {packages.length > 0 ? (
          <PackageGrid packages={packages} />
        ) : (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <p>Featured packages will appear here once added by admin.</p>
          </div>
        )}
      </div>
    </section>
  );
}
