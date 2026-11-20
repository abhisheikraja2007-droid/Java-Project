import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useEvidence(params?: { status?: string; category?: string; search?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['evidence', params],
    queryFn: () => api.getEvidence(params).then(res => res.data),
  });
}

export function useEvidenceById(id: string) {
  return useQuery({
    queryKey: ['evidence', id],
    queryFn: () => api.getEvidenceById(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useEvidenceByCase(caseId: string) {
  return useQuery({
    queryKey: ['evidence', 'case', caseId],
    queryFn: () => api.getEvidenceByCase(caseId).then(res => res.data),
    enabled: !!caseId,
  });
}

export function useUpdateEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateEvidence(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['evidence'] });
      qc.invalidateQueries({ queryKey: ['evidence', vars.id] });
    },
  });
}

export function useCheckoutEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { officerName: string; badgeNumber: string; reason: string; expectedReturnDate: string; hmacSignature: string } }) =>
      api.checkoutEvidence(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['evidence'] });
      qc.invalidateQueries({ queryKey: ['evidence', vars.id] });
    },
  });
}

export function useCheckinEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { custodianName: string; badgeNumber: string } }) =>
      api.checkinEvidence(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['evidence'] });
      qc.invalidateQueries({ queryKey: ['evidence', vars.id] });
    },
  });
}

export function useUpdateEvidenceStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.updateEvidenceStatus(id, status),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['evidence'] });
      qc.invalidateQueries({ queryKey: ['evidence', vars.id] });
    },
  });
}