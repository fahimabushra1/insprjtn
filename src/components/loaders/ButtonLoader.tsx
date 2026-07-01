import { cn } from "@/lib/utils";

interface ButtonLoaderProps {
  className?: string;
}

export default function ButtonLoader({ className }: ButtonLoaderProps) {
  return (
    <div className={cn("h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)} />
  );
}
