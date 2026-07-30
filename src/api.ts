import axios from 'axios';
import type { AccountDto } from './pojo/AccountDto';
import { store } from '@/stores/storeAuth';

const API_BASE_URL = 'https://proxy.chonghe.dpdns.org/api/pms-bak';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

function getAuthToken(): string | null {
  return (store as any).backendAuthKey || localStorage.getItem('PMS_BACKEND_AUTH_KEY') || null;
}

async function request<T>(method: 'get' | 'post', url: string, data?: unknown) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.request<T>({
    method,
    url: `${API_BASE_URL}${url}`,
    data,
    headers,
    timeout: 10000,
  });

  return response.data;
}

export async function healthCheck() {
  return request<{ status: string; service: string; timestamp: string }>('get', '/api/health');
}

export async function getAllAccAPI(): Promise<AccountDto[]> {
  const response = await request<ApiResponse<AccountDto[]>>('get', '/controller/list');
  if (!response.success) {
    throw new Error(response.error || response.message || '获取账号列表失败');
  }

  return response.data ?? [];
}

export async function addAccountAPI(payload: Partial<AccountDto>): Promise<number> {
  const response = await request<ApiResponse<{ id: number }>>('post', '/controller/add', payload);
  if (!response.success) {
    throw new Error(response.error || response.message || '新增账号失败');
  }

  return response.data?.id ?? 0;
}

export async function deleteAccountAPI(id: number): Promise<void> {
  const response = await request<ApiResponse<unknown>>('post', '/controller/delete', { id });
  if (!response.success) {
    throw new Error(response.error || response.message || '删除账号失败');
  }
}

export async function updateAccountAPI(payload: Partial<AccountDto>): Promise<void> {
  const response = await request<ApiResponse<unknown>>('post', '/controller/update', payload);
  if (!response.success) {
    throw new Error(response.error || response.message || '更新账号失败');
  }
}

export async function rotateAccountsAPI(items: Array<{ id: number; acc: string; pin: string }>): Promise<void> {
  const response = await request<ApiResponse<unknown>>('post', '/controller/rotate', { items });
  if (!response.success) {
    throw new Error(response.error || response.message || '轮转失败');
  }
}

const CACHE_KEY = 'PMS_CACHED_ACCOUNTS';

export function saveAccountsToCache(accounts: AccountDto[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(accounts));
  } catch {
    console.warn('Failed to cache accounts in localStorage');
  }
}

export function loadAccountsFromCache(): AccountDto[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AccountDto[];
  } catch {
    return null;
  }
}
