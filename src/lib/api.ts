import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = useAuthStore.getState().refreshToken;
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
              const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;
              
              useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
              
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              }
              return this.client(originalRequest);
            }
          } catch {
            useAuthStore.getState().logout();
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Cases
  getCases = (params?: { status?: string; priority?: string; search?: string; page?: number; size?: number }) =>
    this.client.get('/cases', { params });

  getCase = (id: string) => this.client.get(`/cases/${id}`);

  createCase = (data: any) => this.client.post('/cases', data);

  updateCase = (id: string, data: any) => this.client.put(`/cases/${id}`, data);

  deleteCase = (id: string) => this.client.delete(`/cases/${id}`);

  addTimelineEvent = (caseId: string, event: any) => this.client.post(`/cases/${caseId}/timeline`, event);

  promoteFromIncident = (incidentId: string) => this.client.post(`/cases/from-incident/${incidentId}`);

  // Evidence
  getEvidence = (params?: { status?: string; category?: string; search?: string; page?: number; size?: number }) =>
    this.client.get('/evidence', { params });

  getEvidenceById = (id: string) => this.client.get(`/evidence/${id}`);

  getEvidenceByCase = (caseId: string) => this.client.get(`/evidence/case/${caseId}`);

  getExpiringEvidence = (days: number = 30) => this.client.get('/evidence/expiring', { params: { days } });

  createEvidence = (data: any) => this.client.post('/evidence', data);

  updateEvidence = (id: string, data: any) => this.client.put(`/evidence/${id}`, data);

  checkoutEvidence = (id: string, data: { officerName: string; badgeNumber: string; reason: string; expectedReturnDate: string; hmacSignature: string }) =>
    this.client.post(`/evidence/${id}/checkout`, data);

  checkinEvidence = (id: string, data: { custodianName: string; badgeNumber: string }) =>
    this.client.post(`/evidence/${id}/checkin`, data);

  updateEvidenceStatus = (id: string, status: string) => this.client.patch(`/evidence/${id}/status`, { status });

  verifyChainOfCustody = (id: string) => this.client.get(`/evidence/${id}/verify-chain`);

  // Suspects
  getSuspects = (params?: { search?: string; page?: number; size?: number }) =>
    this.client.get('/suspects', { params });

  getSuspectById = (id: string) => this.client.get(`/suspects/${id}`);

  getSuspectsByStatus = (status: string) => this.client.get(`/suspects/status/${status}`);

  getSuspectsByRiskLevel = (riskLevel: string) => this.client.get(`/suspects/risk/${riskLevel}`);

  createSuspect = (data: any) => this.client.post('/suspects', data);

  updateSuspect = (id: string, data: any) => this.client.put(`/suspects/${id}`, data);

  addAlias = (id: string, alias: string) => this.client.post(`/suspects/${id}/aliases`, { alias });

  addCriminalRecord = (id: string, record: any) => this.client.post(`/suspects/${id}/criminal-record`, record);

  deleteSuspect = (id: string) => this.client.delete(`/suspects/${id}`);

  // Incidents
  getIncidents = (params?: { search?: string; page?: number; size?: number }) =>
    this.client.get('/incidents', { params });

  getIncidentById = (id: string) => this.client.get(`/incidents/${id}`);

  getIncidentsByStatus = (status: string) => this.client.get(`/incidents/status/${status}`);

  getIncidentsByDateRange = (start: string, end: string) => this.client.get('/incidents/date-range', { params: { start, end } });

  createIncident = (data: any) => this.client.post('/incidents', data);

  updateIncident = (id: string, data: any) => this.client.put(`/incidents/${id}`, data);

  promoteToCase = (id: string) => this.client.post(`/incidents/${id}/promote`);

  // Audit Logs
  getAuditLogs = (params?: { category?: string; search?: string; page?: number; size?: number }) =>
    this.client.get('/audit', { params });

  getRecentAuditLogs = (limit: number = 100) => this.client.get('/audit/recent', { params: { limit } });

  getAuditLogsByDateRange = (start: string, end: string, params?: { page?: number; size?: number }) =>
    this.client.get('/audit/date-range', { params: { start, end, ...params } });

  // Users
  getUsers = (params?: { department?: string; role?: string; status?: string; page?: number; size?: number }) =>
    this.client.get('/users', { params });

  getUserById = (id: string) => this.client.get(`/users/${id}`);

  getUserByBadge = (badgeNumber: string) => this.client.get(`/users/badge/${badgeNumber}`);

  createUser = (user: any, password: string) => this.client.post('/users', { user, password });

  updateUser = (id: string, data: any) => this.client.put(`/users/${id}`, data);

  changePassword = (id: string, newPassword: string) => this.client.post(`/users/${id}/password`, { newPassword });

  // Auth
  login = (email: string, password: string) => this.client.post('/auth/login', { email, password });

  refresh = (refreshToken: string) => this.client.post('/auth/refresh', { refreshToken });
}

export const api = new ApiClient();
export default api;