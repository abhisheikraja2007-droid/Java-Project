import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useUsers(params?: { department?: string; role?: string; status?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => api.getUsers(params).then(res => res.data),
  });
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => api.getUserById(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useUserByBadge(badgeNumber: string) {
  return useQuery({
    queryKey: ['user', 'badge', badgeNumber],
    queryFn: () => api.getUserByBadge(badgeNumber).then(res => res.data),
    enabled: !!badgeNumber,
  });
}