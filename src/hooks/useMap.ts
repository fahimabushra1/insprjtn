import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mapService } from "@/services/map.service";

export function usePlaces(featured?: boolean) {
  return useQuery({
    queryKey: ["places", featured],
    queryFn: () => mapService.getPlaces(featured),
  });
}

export function usePlaceBySlug(slug: string) {
  return useQuery({
    queryKey: ["place", slug],
    queryFn: () => mapService.getPlaceBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreatePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => mapService.createPlace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

export function useUpdatePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => mapService.updatePlace(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

export function useDeletePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mapService.deletePlace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

export function useRoutes() {
  return useQuery({
    queryKey: ["routes"],
    queryFn: () => mapService.getRoutes(),
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => mapService.createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => mapService.updateRoute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mapService.deleteRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}
