"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/30">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Sundarban Tourism · Bangladesh
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Explore the Magic of{" "}
              <span className="text-primary">Sundarban</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Embark on unforgettable journeys through the world&apos;s largest mangrove forest.
              Expert guides, curated packages, and memories that last a lifetime.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={ROUTES.PACKAGES}>
                  View Tour Packages
                  <FiArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.CONTACT}>Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
