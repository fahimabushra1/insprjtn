import { createMetadata } from "@/utils/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with Insaniat Parjatan for Sundarban tour inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold md:text-4xl">Contact Us</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Have questions about our Sundarban tours? Reach out via WhatsApp using the
        floating button, or email us at info@insaniatparjatan.com.
      </p>
      <p className="mt-4 text-muted-foreground">
        Full contact form will be available in Phase 3.
      </p>
    </div>
  );
}
