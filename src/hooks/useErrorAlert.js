import { toast } from "sonner";

export function useErrorAlert() {
  return (message, description) => {
    toast.error(message, { description });
  };
}
