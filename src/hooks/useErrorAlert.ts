import { toast } from "sonner";

export function useErrorAlert() {
  return (message: string, description?: string) => {
    toast.error(message, { description });
  };
}
