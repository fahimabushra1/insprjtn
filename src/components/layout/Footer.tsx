import Link from "next/link";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { ROUTES, NAV_LINKS } from "@/constants/routes";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href={ROUTES.HOME} className="text-xl font-bold text-primary">
              Insaniat Parjatan
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover the magic of the Sundarban with expertly guided tours.
              Experience Bangladesh&apos;s largest mangrove forest with Insaniat Parjatan.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <FiMapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="h-4 w-4 shrink-0 text-primary" />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="h-4 w-4 shrink-0 text-primary" />
                <span>info@insaniatparjatan.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Sundarban Tours</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              From day trips to multi-day adventures, we offer curated experiences
              through the world&apos;s largest mangrove ecosystem.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {currentYear} Insaniat Parjatan. All rights reserved.</p>
          <p>Crafted with care for nature lovers</p>
        </div>
      </div>
    </footer>
  );
}
