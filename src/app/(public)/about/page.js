import { createMetadata } from "@/utils/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "About Us",
  description: "Learn about Insaniat Parjatan and our Sundarban tour expertise.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold md:text-4xl">About Insaniat Parjatan</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">
        Insaniat Parjatan is a dedicated Sundarban tourism company based in Bangladesh.
        We specialize in curated mangrove forest experiences — from day excursions to
        multi-day adventures — led by expert local guides who know the tides, trails,
        and wildlife of this UNESCO World Heritage site.
      </p>
      <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">
        Full about page content will be expanded in a future phase.
      </p>
    </div>
  );
}
