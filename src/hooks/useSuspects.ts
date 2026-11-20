import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useSuspects(params?: { search?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['suspects', params],
    queryFn: () => api.getSuspects(params).then(res => res.data),
  });
}

export function useSuspectById(id: string) {
  return useQuery({
    queryKey: ['suspect', id],
    queryFn: () => api.getSuspectById(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useSuspectsByStatus(status: string) {
  return useQuery({
    queryKey: ['suspects', 'status', status],
    queryFn: () => api.getSuspectsByStatus(status).then(res => res.data),
    enabled: !!status,
  });
}

export function useSuspectsByRiskLevel(riskLevel: string) {
  return useQuery({
    queryKey: ['suspects', 'risk', riskLevel],
    queryFn: () => api.getSuspectsByRiskLevel(riskLevel).then(res => res.data),
    enabled: !!riskLevel,
  });
}

export function useCreateSuspect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createSuspect,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suspects'] }),
  });
}

export function useUpdateSuspect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateSuspect(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['suspects'] });
      qc.invalidateQueries({ queryKey: ['suspect', vars.id] });
    },
  });
}

export function useAddAlias() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, alias }: { id: string; alias: string }) => api.addAlias(id, alias),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['suspects'] });
      qc.invalidateQueries({ queryKey: ['suspect', vars.id] });
    },
  });
}

export function useAddCriminalRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, record }: { id: string; record: any }) => api.addCriminalRecord(id, record),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['suspects'] });
      qc.invalidateQueries({ queryKey: ['suspect', vars.id] });
    },
  });
}

export function useDeleteSuspect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteSuspect,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suspects'] }),
  });
}