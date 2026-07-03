import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";

export function usePayments(params = {}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: async () => {
      try {
        const res = await paymentService.getAll(params);
        return res || { data: { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } } };
      } catch (err) {
        console.error("usePayments error:", err);
        return { data: { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } } };
      }
    },
  });
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => paymentService.submit(data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", data.data?.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentService.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
