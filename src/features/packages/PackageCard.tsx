"use client";

import Link from "next/link";
import Image from "next/image";
import { FiClock, FiMapPin } from "react-icons/fi";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { ROUTES } from "@/constants/routes";
import { useLanguage } from "@/providers/LanguageProvider";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80";

export default function PackageCard({ pkg }) {
  const { language } = useLanguage();
  const imageUrl = pkg.images?.[0] || PLACEHOLDER_IMAGE;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={pkg.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {pkg.featured && (
          <Badge className="absolute left-3 top-3" variant="success">
            {language === "en" ? "Featured" : "সেরা অফার"}
          </Badge>
        )}
      </div>
      <CardContent className="space-y-3 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{pkg.title}</h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FiMapPin className="h-3.5 w-3.5" />
            {pkg.location}
          </span>
          <span className="flex items-center gap-1">
            <FiClock className="h-3.5 w-3.5" />
            {pkg.duration}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{pkg.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="text-lg font-bold text-primary">{formatCurrency(pkg.price)}</span>
        <Button asChild size="sm">
          <Link href={ROUTES.PACKAGE_DETAILS(pkg.slug)}>
            {language === "en" ? "View Details" : "বিস্তারিত দেখুন"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
