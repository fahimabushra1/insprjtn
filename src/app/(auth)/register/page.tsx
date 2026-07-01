import RegisterForm from "@/features/auth/RegisterForm";
import { createMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Register",
  description: "Create an Insaniat Parjatan account to book Sundarban tours",
  path: "/register",
});

export default function RegisterPage() {
  return <RegisterForm />;
}
