import { Incident, AuditLog, RouteComparisonResponse, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` : '/api';

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('sahaay_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchIncidents(params?: {
  hazard_type?: string;
  status?: string;
  search?: string;
  demo_only?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ total: number; items: Incident[] }> {
  const query = new URLSearchParams();
  if (params?.hazard_type) query.append('hazard_type', params.hazard_type);
  if (params?.status) query.append('status', params.status);
  if (params?.search) query.append('search', params.search);
  if (params?.demo_only) query.append('demo_only', 'true');
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.offset) query.append('offset', params.offset.toString());

  const res = await fetch(`${API_BASE}/incidents?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function fetchIncidentById(id: string): Promise<{
  incident: Incident;
  audits: AuditLog[];
  related_reports: { id: string; distance_meters: number; similarity: number }[];
}> {
  const res = await fetch(`${API_BASE}/incidents/${id}`);
  if (!res.ok) throw new Error('Failed to load incident details');
  return res.json();
}

export async function submitReport(formData: FormData): Promise<Incident> {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to submit report' }));
    throw new Error(err.detail || 'Failed to submit report');
  }
  return res.json();
}

export async function fetchMyReports(): Promise<Incident[]> {
  const res = await fetch(`${API_BASE}/reports/mine`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch personal reports');
  return res.json();
}

export async function triggerAnalysis(id: string): Promise<Incident> {
  const res = await fetch(`${API_BASE}/reports/${id}/analyze`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Analysis request failed');
  return res.json();
}

export async function verifyIncident(id: string, status: string, notes?: string): Promise<Incident> {
  const res = await fetch(`${API_BASE}/incidents/${id}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Verification failed' }));
    throw new Error(err.detail || 'Verification failed');
  }
  return res.json();
}

export async function resolveIncident(id: string, notes?: string): Promise<Incident> {
  const res = await fetch(`${API_BASE}/incidents/${id}/resolve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Resolve failed' }));
    throw new Error(err.detail || 'Resolve failed');
  }
  return res.json();
}

export async function markIncidentStale(id: string): Promise<Incident> {
  const res = await fetch(`${API_BASE}/incidents/${id}/stale`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to mark stale');
  return res.json();
}

export async function mergeIncident(id: string, targetId: string, reason?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/incidents/${id}/merge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ target_incident_id: targetId, reason }),
  });
  if (!res.ok) throw new Error('Failed to merge incidents');
  return res.json();
}

export async function flagIncident(id: string, reason: string): Promise<any> {
  const res = await fetch(`${API_BASE}/incidents/${id}/flag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Failed to flag incident');
  return res.json();
}

export async function compareRoutes(params: {
  start_lat: number;
  start_lon: number;
  end_lat: number;
  end_lon: number;
}): Promise<RouteComparisonResponse> {
  const res = await fetch(`${API_BASE}/routes/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to compare routes');
  return res.json();
}

export async function fetchAdminAnalytics(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/analytics`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to load admin analytics');
  return res.json();
}

export async function fetchAdminAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/admin/audit-logs`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to load audit logs');
  return res.json();
}

export async function fetchAdminSettings(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to load admin settings');
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function signupUser(payload: { email: string; password: string; full_name: string; role?: string }): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail || 'Signup failed');
  }
  return res.json();
}
