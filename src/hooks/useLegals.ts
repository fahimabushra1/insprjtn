import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { legalService } from "@/services/legal.service";

export function useAdminLegals() {
  return useQuery({
    queryKey: ["admin", "legals"],
    queryFn: async () => {
      try {
        const res = await legalService.getAllAdmin();
        return res || { data: { items: [] } };
      } catch (err) {
        console.error("useAdminLegals error:", err);
        return { data: { items: [] } };
      }
    },
  });
}

export function useLegalBySlug(slug: string) {
  return useQuery({
    queryKey: ["legals", slug],
    queryFn: async () => {
      try {
        const res = await legalService.getBySlug(slug);
        return res || { data: null };
      } catch (err) {
        console.error("useLegalBySlug error:", err);
        return { data: null };
      }
    },
    enabled: !!slug,
  });
}

export function useCreateLegal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => legalService.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "legals"] });
    },
  });
}

export function useUpdateLegal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      legalService.updateAdmin(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "legals"] });
      queryClient.invalidateQueries({ queryKey: ["legals"] });
      if (data?.data?.slug) {
        queryClient.invalidateQueries({ queryKey: ["legals", data.data.slug] });
      }
    },
  });
}

export function useDeleteLegal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => legalService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "legals"] });
      queryClient.invalidateQueries({ queryKey: ["legals"] });
    },
  });
}
