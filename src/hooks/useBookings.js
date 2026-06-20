import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";

export function useBookings(params = {}) {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => bookingService.getAll(params),
  });
}

export function useBookingDetails(id) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => bookingService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => bookingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => bookingService.cancel(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
    },
  });
}
