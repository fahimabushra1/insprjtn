"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiShoppingCart, FiPhoneCall } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/providers/LanguageProvider";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
}

interface ShopClientProps {
  initialProducts: Product[];
  activeCategory: string;
  activeSearch: string;
}

export default function ShopClient({
  initialProducts,
  activeCategory,
  activeSearch,
}: ShopClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [search, setSearch] = useState(activeSearch);
  const [isPending, startTransition] = useTransition();

  const handleFilter = (category: string) => {
    const params = new URLSearchParams();
    if (category && category !== "all") {
      params.set("category", category);
    }
    if (search) {
      params.set("search", search);
    }
    startTransition(() => {
      router.push(`/shop?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeCategory && activeCategory !== "all") {
      params.set("category", activeCategory);
    }
    if (search) {
      params.set("search", search);
    }
    startTransition(() => {
      router.push(`/shop?${params.toString()}`);
    });
  };

  const getCategoryLabel = (cat: string) => {
    if (language === "bn") {
      switch (cat.toLowerCase()) {
        case "honey": return "সুন্দরবনের খাঁটি মধু";
        case "gear": return "ট্যুর গিয়ার";
        case "souvenirs": return "হস্তশিল্প";
        default: return cat;
      }
    }
    switch (cat.toLowerCase()) {
      case "honey": return "Organic Honey";
      case "gear": return "Tour Gear";
      case "souvenirs": return "Handicraft Souvenir";
      default: return cat;
    }
  };

  const handleWhatsAppOrder = (product: Product) => {
    const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801531706191";
    const text = encodeURIComponent(
      `Hello Insaniat Parjatan! I would like to order: ${product.name} (Price: BDT ${product.price}). Please let me know how to proceed.`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${text}`, "_blank");
  };

  const categories = [
    { id: "all", en: "All Products", bn: "সব পণ্য" },
    { id: "honey", en: "Sundarban Honey", bn: "সুন্দরবনের মধু" },
    { id: "gear", en: "Tour Gear", bn: "ট্যুর গিয়ার" },
    { id: "souvenirs", en: "Souvenirs", bn: "স্মারক উপহার" },
  ];

  return (
    <div className="space-y-8">
      {/* Category Pills & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6 border-emerald-950/5">
        <div className="flex flex-wrap gap-2 order-2 md:order-1">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              onClick={() => handleFilter(cat.id)}
              className={`rounded-full text-xs font-semibold px-5 h-9 transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-primary hover:bg-primary/95 text-white"
                  : "border-slate-200 text-slate-700 hover:bg-emerald-50/50"
              }`}
            >
              {language === "bn" ? cat.bn : cat.en}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full order-1 md:order-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
          <Input
            placeholder={language === "bn" ? "পণ্য খুঁজুন..." : "Search products..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full border-slate-200 bg-white text-slate-900 focus-visible:ring-emerald-600 rounded-full"
          />
        </form>
      </div>

      {/* Grid List */}
      {isPending ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-2xl border" />
          ))}
        </div>
      ) : initialProducts.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-emerald-950/10 max-w-md mx-auto space-y-3">
          <FiShoppingCart className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">
            {language === "bn" ? "কোন পণ্য পাওয়া যায়নি" : "No products found"}
          </h3>
          <p className="text-slate-400 text-xs px-6">
            {language === "bn"
              ? "আপনার খোঁজা ক্যাটাগরি বা শব্দে কোন পণ্য মেলেনি। অন্য ক্যাটাগরি ট্রাই করুন।"
              : "We couldn't find any products matching your query. Try selecting another filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {initialProducts.map((product) => (
            <Card
              key={product._id}
              className="group overflow-hidden rounded-2xl border border-emerald-950/5 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-100">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300 font-bold text-xs bg-slate-100">
                    No Image
                  </div>
                )}
                <Badge className="absolute top-3 left-3 bg-emerald-800 text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full hover:bg-emerald-800">
                  {getCategoryLabel(product.category)}
                </Badge>
              </div>

              {/* Card Body */}
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 min-h-[2rem]">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">PRICE</span>
                      <span className="font-extrabold text-lg text-emerald-900">
                        BDT {product.price}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">STOCK</span>
                      <span
                        className={`text-xs font-bold ${
                          product.stock > 0 ? "text-emerald-700" : "text-red-500"
                        }`}
                      >
                        {product.stock > 0
                          ? (language === "bn" ? `${product.stock} টি আছে` : `${product.stock} In Stock`)
                          : (language === "bn" ? "স্টক শেষ" : "Out of Stock")}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleWhatsAppOrder(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold text-xs h-10"
                  >
                    <FaWhatsapp className="h-4.5 w-4.5" />
                    {language === "bn" ? "হোয়াটসঅ্যাপে অর্ডার দিন" : "Order on WhatsApp"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
