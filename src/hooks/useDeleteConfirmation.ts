import { toast } from "sonner";

export function useDeleteConfirmation() {
  return (title, onConfirm, description = "This action cannot be undone.") => {
    toast.warning(title, {
      description,
      action: {
        label: "Confirm",
        onClick: onConfirm,
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      duration: 10000,
    });
  };
}
