import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { calendarService } from "@/services/calendar.service";

export function useHolidays() {
  return useQuery({
    queryKey: ["holidays"],
    queryFn: () => calendarService.getHolidays(),
  });
}

export function useCreateHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => calendarService.createHoliday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
  });
}

export function useUpdateHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => calendarService.updateHoliday(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
  });
}

export function useDeleteHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => calendarService.deleteHoliday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
  });
}

export function useSeasons() {
  return useQuery({
    queryKey: ["seasons"],
    queryFn: () => calendarService.getSeasons(),
  });
}

export function useUpdateSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => calendarService.updateSeason(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
    },
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => calendarService.getAnnouncements(),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => calendarService.createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => calendarService.updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => calendarService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useAvailabilities() {
  return useQuery({
    queryKey: ["availabilities"],
    queryFn: () => calendarService.getAvailabilities(),
  });
}

export function useUpsertAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => calendarService.upsertAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => calendarService.deleteAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
    },
  });
}
