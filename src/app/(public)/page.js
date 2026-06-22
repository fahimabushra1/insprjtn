import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import HeroSection from "@/features/home/HeroSection";
import FeaturedPackagesSection from "@/features/home/FeaturedPackagesSection";
import WhyChooseUsSection from "@/features/home/WhyChooseUsSection";
import TestimonialsSection from "@/features/home/TestimonialsSection";
import LatestBlogsSection from "@/features/home/LatestBlogsSection";
import { fetchFeaturedServer } from "@/services/package.server";
import { fetchBlogsServer } from "@/services/blog.server";
import { fetchTestimonialsServer } from "@/services/testimonial.server";
import { createMetadata } from "@/utils/seo";
import { ROUTES } from "@/constants/routes";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Home",
  description:
    "Discover Sundarban tour packages with Insaniat Parjatan. Expert-guided mangrove forest adventures in Bangladesh.",
  path: "/",
});

export default async function HomePage() {
  let featuredPackages = [];
  let latestBlogs = [];
  let testimonials = [];

  try {
    const packagesRes = await fetchFeaturedServer();
    featuredPackages = packagesRes?.data || [];
  } catch {
    featuredPackages = [];
  }

  try {
    const blogsRes = await fetchBlogsServer({ page: 1, limit: 3 });
    latestBlogs = blogsRes?.data?.items || [];
  } catch {
    latestBlogs = [];
  }

  try {
    const testimonialsRes = await fetchTestimonialsServer({ page: 1, limit: 3 });
    testimonials = testimonialsRes?.data?.items || [];
  } catch {
    testimonials = [];
  }

  return (
    <>
      <HeroSection />
      <FeaturedPackagesSection packages={featuredPackages} />
      <WhyChooseUsSection />
      <TestimonialsSection testimonials={testimonials} />
      <LatestBlogsSection blogs={latestBlogs} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready for Your Sundarban Adventure?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Browse our tour packages or get in touch — we&apos;ll help you plan
              the perfect trip to the mangrove forest.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href={ROUTES.PACKAGES}>
                  Explore Packages
                  <FiArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href={ROUTES.CONTACT}>Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
