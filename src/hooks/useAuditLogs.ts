import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useAuditLogs(params?: { category?: string; search?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['audit', params],
    queryFn: () => api.getAuditLogs(params).then(res => res.data),
  });
}

export function useRecentAuditLogs(limit: number = 100) {
  return useQuery({
    queryKey: ['audit', 'recent', limit],
    queryFn: () => api.getRecentAuditLogs(limit).then(res => res.data),
  });
}

export function useAuditLogsByDateRange(start: string, end: string, params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ['audit', 'range', start, end, params],
    queryFn: () => api.getAuditLogsByDateRange(start, end, params).then(res => res.data),
    enabled: !!start && !!end,
  });
}