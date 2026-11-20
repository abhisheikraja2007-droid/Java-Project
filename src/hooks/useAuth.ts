import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => api.login(email, password),
    onSuccess: (data) => {
      const { token, refreshToken, userId, name, role, permissions } = data.data;
      useAuthStore.getState().login(token, refreshToken, {
        id: userId,
        name,
        email: '', // not returned, will be filled by user fetch
        role,
        badgeNumber: '',
        permissions: permissions || [],
      });
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => api.refresh(refreshToken),
    onSuccess: (data) => {
      const { token: newAccessToken, refreshToken: newRefreshToken } = data.data;
      useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {}, // no backend call needed
    onSuccess: () => {
      useAuthStore.getState().logout();
    },
  });
}