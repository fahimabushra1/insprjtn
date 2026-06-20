import { useMemo } from "react";
import api from "@/services/api";

export function useAxios() {
  return useMemo(() => api, []);
}
