import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import FacebookPixelTracker from "@/components/analytics/FacebookPixelTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Insaniat Parjatan | Sundarban Tours Bangladesh",
  description:
    "Discover Sundarban tour packages with Insaniat Parjatan. Expert-guided mangrove forest adventures in Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('vite-ui-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider>
                <FacebookPixelTracker />
                {children}
                <Toaster position="top-right" richColors closeButton />
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
