import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-4 py-4">
        <Link href={ROUTES.HOME} className="text-xl font-bold text-primary">
          Insaniat Parjatan
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
