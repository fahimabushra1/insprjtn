"use client";

import { motion } from "framer-motion";
import { FiCompass, FiShield, FiUsers } from "react-icons/fi";

const features = [
  {
    icon: FiCompass,
    title: "Expert Local Guides",
    description: "Navigate the Sundarban safely with experienced guides who know every trail and tidal channel.",
  },
  {
    icon: FiShield,
    title: "Safe & Secure",
    description: "Your safety is our priority. All tours follow strict safety protocols and regulations.",
  },
  {
    icon: FiUsers,
    title: "Small Group Tours",
    description: "Intimate group sizes ensure personalized attention and a more immersive experience.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Why Choose Insaniat Parjatan</h2>
          <p className="mt-2 text-muted-foreground">
            Your trusted partner for Sundarban adventures
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl border bg-card p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
