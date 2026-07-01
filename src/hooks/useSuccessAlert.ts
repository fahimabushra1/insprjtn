import { toast } from "sonner";

export function useSuccessAlert() {
  return (message: string, description?: string) => {
    toast.success(message, { description });
  };
}
