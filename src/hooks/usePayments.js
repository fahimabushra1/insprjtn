import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";

export function usePayments(params = {}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => paymentService.getAll(params),
  });
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => paymentService.submit(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", data.data?.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
