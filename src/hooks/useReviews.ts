import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";

export function useReviews(slugOrId: string) {
  return useQuery({
    queryKey: ["reviews", slugOrId],
    queryFn: async () => {
      try {
        const res = await reviewService.getByPackage(slugOrId);
        return res?.data || { reviews: [], averageRating: 0, totalReviews: 0 };
      } catch (err) {
        console.error("useReviews error:", err);
        return { reviews: [], averageRating: 0, totalReviews: 0 };
      }
    },
    enabled: !!slugOrId,
  });
}

export function useCreateReview(slugOrId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) =>
      reviewService.create(slugOrId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", slugOrId] });
      // Invalidate specific package queries
      queryClient.invalidateQueries({ queryKey: ["packages", slugOrId] });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
}
