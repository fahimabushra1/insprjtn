"use client";

import Link from "next/link";
import { FiMenu, FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NAV_LINKS, ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/providers/ThemeProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const getNavLabel = (label: string) => {
    if (language === "bn") {
      switch (label) {
        case "Home": return "হোম";
        case "Packages": return "প্যাকেজসমূহ";
        case "Shop": return "শপ";
        case "Blog": return "ব্লগ";
        case "Gallery": return "গ্যালারি";
        case "Testimonials": return "প্রশংসাপত্র";
        case "About": return "আমাদের সম্পর্কে";
        case "Contact": return "যোগাযোগ";
        default: return label;
      }
    }
    return label;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Insaniat</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">Parjatan</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {getNavLabel(link.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {/* Theme & Language Toggles */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <FiSun className="h-4.5 w-4.5 text-yellow-500" />
            ) : (
              <FiMoon className="h-4.5 w-4.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            title="Toggle language"
            className="h-9 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <FiGlobe className="h-3.5 w-3.5" />
            <span>{language === "en" ? "EN" : "বাং"}</span>
          </Button>

          {!loading && (
            isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.photo} alt={user?.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.ADMIN}>
                        {language === "en" ? "Admin Dashboard" : "এডমিন ড্যাশবোর্ড"}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.DASHBOARD}>
                      {language === "en" ? "My Dashboard" : "আমার ড্যাশবোর্ড"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    {language === "en" ? "Log out" : "লগ আউট"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href={ROUTES.LOGIN}>
                    {language === "en" ? "Login" : "লগইন"}
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={ROUTES.REGISTER}>
                    {language === "en" ? "Sign Up" : "নিবন্ধন"}
                  </Link>
                </Button>
              </>
            )
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <FiMenu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{language === "en" ? "Menu" : "মেনু"}</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                  )}
                >
                  {getNavLabel(link.label)}
                </Link>
              ))}

              {/* Mobile Theme & Language Toggles */}
              <div className="flex items-center gap-3 py-3 border-t border-b border-muted">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex justify-center items-center gap-2 h-9 border-muted"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <>
                      <FiSun className="h-4 w-4 text-yellow-500" />
                      <span>{language === "en" ? "Light" : "লাইট"}</span>
                    </>
                  ) : (
                    <>
                      <FiMoon className="h-4 w-4" />
                      <span>{language === "en" ? "Dark" : "ডার্ক"}</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex justify-center items-center gap-2 h-9 border-muted"
                  onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                >
                  <FiGlobe className="h-4 w-4" />
                  <span>{language === "en" ? "English" : "বাংলা"}</span>
                </Button>
              </div>

              <div className="mt-2 flex flex-col gap-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link href={ROUTES.DASHBOARD} className="text-sm font-medium">
                      {language === "en" ? "My Dashboard" : "আমার ড্যাশবোর্ড"}
                    </Link>
                    <button
                      onClick={logout}
                      className="text-left text-sm font-medium text-destructive"
                    >
                      {language === "en" ? "Log out" : "লগ আউট"}
                    </button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href={ROUTES.LOGIN}>
                        {language === "en" ? "Login" : "লগইন"}
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href={ROUTES.REGISTER}>
                        {language === "en" ? "Sign Up" : "নিবন্ধন"}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
