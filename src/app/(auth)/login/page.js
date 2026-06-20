import LoginForm from "@/features/auth/LoginForm";
import { createMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Login",
  description: "Sign in to your Insaniat Parjatan account",
  path: "/login",
});

export default function LoginPage() {
  return <LoginForm />;
}
