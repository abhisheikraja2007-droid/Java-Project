import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useIncidents(params?: { search?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['incidents', params],
    queryFn: () => api.getIncidents(params).then(res => res.data),
  });
}

export function useIncidentById(id: string) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: () => api.getIncidentById(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useIncidentsByStatus(status: string) {
  return useQuery({
    queryKey: ['incidents', 'status', status],
    queryFn: () => api.getIncidentsByStatus(status).then(res => res.data),
    enabled: !!status,
  });
}

export function useIncidentsByDateRange(start: string, end: string) {
  return useQuery({
    queryKey: ['incidents', 'range', start, end],
    queryFn: () => api.getIncidentsByDateRange(start, end).then(res => res.data),
    enabled: !!start && !!end,
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createIncident,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['incidents'] }),
  });
}

export function useUpdateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateIncident(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['incidents'] });
      qc.invalidateQueries({ queryKey: ['incident', vars.id] });
    },
  });
}

export function usePromoteToCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.promoteToCase,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] });
      qc.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}