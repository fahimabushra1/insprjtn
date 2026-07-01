"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiUser } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes";

export default function TestimonialsSection({ testimonials = [] }) {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <FaStar
            key={index}
            className={`h-4 w-4 ${
              index < rating ? "text-amber-500 fill-amber-500" : "text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-emerald-950/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold">What Our Guests Say</h2>
            <p className="mt-2 text-muted-foreground">
              Feedback and stories from travelers who explored the Sundarbans with us
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={ROUTES.TESTIMONIALS}>
              View All Reviews
              <FiArrowRight className="ml-2" />
            </Link>
          </Button>
        </motion.div>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((item) => (
              <Card key={item._id} className="border-emerald-950/10 bg-card/65 flex flex-col justify-between">
                <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    {renderStars(item.rating)}
                    <p className="text-muted-foreground leading-relaxed text-sm italic">
                      &ldquo;{item.review}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-emerald-950/5">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={item.photo} alt={item.name} />
                      <AvatarFallback>
                        <FiUser />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-semibold">{item.name}</h4>
                      <span className="text-xs text-muted-foreground">{item.designation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <p>Testimonials will appear here once added.</p>
          </div>
        )}
      </div>
    </section>
  );
}
