import { toast } from "sonner";

export function useSuccessAlert() {
  return (message, description) => {
    toast.success(message, { description });
  };
}
