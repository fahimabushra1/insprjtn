import { createMetadata } from "@/utils/seo";

export const metadata = createMetadata({
  title: "About Us",
  description: "Learn about Insaniat Parjatan and our Sundarban tour expertise.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
