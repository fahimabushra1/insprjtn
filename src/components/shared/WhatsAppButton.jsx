"use client";

import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function WhatsAppButton({ className }) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801XXXXXXXXX";
  const message = encodeURIComponent(
    "Hello! I'm interested in booking a Sundarban tour with Insaniat Parjatan."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
        className
      )}
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
