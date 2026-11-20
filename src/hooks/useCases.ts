import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useCases(params?: { status?: string; priority?: string; search?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['cases', params],
    queryFn: () => api.getCases(params).then(res => res.data),
  });
}

export function useCaseById(id: string) {
  return useQuery({
    queryKey: ['case', id],
    queryFn: () => api.getCase(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreateCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createCase,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
  });
}

export function useUpdateCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateCase(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['cases'] });
      qc.invalidateQueries({ queryKey: ['case', vars.id] });
    },
  });
}

export function useAddTimelineEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, event }: { caseId: string; event: any }) => api.addTimelineEvent(caseId, event),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['case', vars.caseId] }),
  });
}