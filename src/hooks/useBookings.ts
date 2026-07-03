import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";

export function useBookings(params = {}) {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: async () => {
      try {
        const res = await bookingService.getAll(params);
        return res || { data: { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } } };
      } catch (err) {
        console.error("useBookings error:", err);
        return { data: { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } } };
      }
    },
  });
}

export function useBookingDetails(id) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async () => {
      try {
        const res = await bookingService.getById(id);
        return res || { data: null };
      } catch (err) {
        console.error("useBookingDetails error:", err);
        return { data: null };
      }
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => bookingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => bookingService.updateStatus(id, status),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
