import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryService } from "@/services/gallery.service";

export function useGallery(params = {}) {
  return useQuery({
    queryKey: ["gallery", params],
    queryFn: () => galleryService.getAll(params),
  });
}

export function useCreateGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => galleryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useDeleteGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => galleryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}
