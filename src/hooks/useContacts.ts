import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactService } from "@/services/contact.service";

export function useContactMessages(params = {}) {
  return useQuery({
    queryKey: ["contacts", params],
    queryFn: () => contactService.getAll(params),
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: any) => contactService.submit(data),
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => contactService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
