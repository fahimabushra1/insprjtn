import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { faqService } from "@/services/faq.service";

export function useFaqs(params = {}) {
  return useQuery({
    queryKey: ["faqs", params],
    queryFn: async () => {
      try {
        const res = await faqService.getAll(params);
        return res || { data: { items: [] } };
      } catch (err) {
        console.error("useFaqs error:", err);
        return { data: { items: [] } };
      }
    },
  });
}

export function useFaqDetails(id: string) {
  return useQuery({
    queryKey: ["faqs", id],
    queryFn: async () => {
      try {
        const res = await faqService.getById(id);
        return res || { data: null };
      } catch (err) {
        console.error("useFaqDetails error:", err);
        return { data: null };
      }
    },
    enabled: !!id,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => faqService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      faqService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs", id] });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => faqService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}
