import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      try {
        const res = await productService.getAll(params);
        return res || { data: [] };
      } catch (err) {
        console.error("useProducts error:", err);
        return { data: [] };
      }
    },
  });
}

export function useProductDetails(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      try {
        const res = await productService.getById(id);
        return res || { data: null };
      } catch (err) {
        console.error("useProductDetails error:", err);
        return { data: null };
      }
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      productService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
