import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageService } from "@/services/package.service";

export function usePackages(params = {}) {
  return useQuery({
    queryKey: ["packages", params],
    queryFn: () => packageService.getAll(params),
  });
}

export function useFeaturedPackages() {
  return useQuery({
    queryKey: ["packages", "featured"],
    queryFn: () => packageService.getFeatured(),
  });
}

export function usePackageBySlug(slug) {
  return useQuery({
    queryKey: ["packages", slug],
    queryFn: () => packageService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function usePackageById(id) {
  return useQuery({
    queryKey: ["packages", "id", id],
    queryFn: () => packageService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => packageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => packageService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => packageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
