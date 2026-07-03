import { fetchProductsServer } from "@/services/product.server";
import { createMetadata } from "@/utils/seo";
import ShopClient from "@/features/shop/ShopClient";

// Since it depends on searchParams, it is dynamic
export async function generateMetadata({ searchParams }: any) {
  const params = await searchParams;
  const category = params?.category || "all";
  const search = params?.search || "";

  let categoryLabel = "";
  if (category === "honey") categoryLabel = "Sundarban Organic Honey | ";
  else if (category === "gear") categoryLabel = "Tour Gear & Equipment | ";
  else if (category === "souvenirs") categoryLabel = "Local Handicrafts | ";

  return createMetadata({
    title: `${categoryLabel}Shop Authentic Sundarban Products`,
    description: `Explore local Sundarban products. Support local conservation communities by purchasing forest honey, tour gear, and souvenirs.`,
    path: `/shop?category=${category}${search ? `&search=${search}` : ""}`,
  });
}

export default async function ShopPage({ searchParams }: any) {
  const params = await searchParams;
  const category = params?.category || "all";
  const search = params?.search || "";

  let products = [];
  try {
    const res = await fetchProductsServer({ category, search });
    products = res?.data || [];
  } catch (error) {
    console.error("Shop page fetch error:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-3">
            Eco-Tourism Shop
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-4">
            Insaniat Parjatan <span className="text-primary">Shop</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Purchase authentic organic honey directly sourced from the deep Sundarban forests, high-quality tour gears, and locally crafted souvenirs.
          </p>
        </div>

        <ShopClient initialProducts={products} activeCategory={category} activeSearch={search} />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
