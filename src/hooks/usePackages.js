import { useQuery } from "@tanstack/react-query";
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
