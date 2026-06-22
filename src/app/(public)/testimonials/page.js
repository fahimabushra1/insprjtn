"use client";

import { motion } from "framer-motion";
import { FiUser, FiMessageSquare } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FullPageLoader from "@/components/loaders/FullPageLoader";

export default function TestimonialsPage() {
  const { data, isLoading, isError } = useTestimonials({ page: 1, limit: 100 });

  const testimonials = data?.data?.items || [];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <FaStar
            key={index}
            className={`h-4.5 w-4.5 ${
              index < rating ? "text-amber-500 fill-amber-500" : "text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-3">
              Traveler Reviews
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-4">
              What Travelers <span className="text-primary">Say</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Read real stories and feedback from adventurers who explored the Sundarbans with us.
            </p>
          </motion.div>
        </div>

        {/* Content */}
        {isLoading ? (
          <FullPageLoader />
        ) : isError ? (
          <div className="py-12 text-center text-destructive">
            Failed to load testimonials. Please try again later.
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FiMessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Testimonials Yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Reviews will show up here once traveler stories are added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full border-emerald-950/10 bg-card/65 flex flex-col justify-between transition-all hover:shadow-md hover:border-emerald-600/20">
                  <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      {renderStars(item.rating)}
                      <p className="text-muted-foreground leading-relaxed text-sm italic">
                        &ldquo;{item.review}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-emerald-950/5">
                      <Avatar className="h-10 w-10 border border-emerald-600/20">
                        <AvatarImage src={item.photo} alt={item.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <FiUser className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-sm font-semibold tracking-tight text-foreground">
                          {item.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {item.designation}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
