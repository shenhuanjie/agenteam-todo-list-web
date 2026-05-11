import axios from 'axios';
import type { Todo, CreateTodoPayload, UpdateTodoPayload, ApiResponse, ListResponse } from '../types/todo';
import { getUserId, getHmacToken } from '../utils/auth';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器：添加认证 header
api.interceptors.request.use(async (config) => {
  const userId = getUserId();
  const token = await getHmacToken(userId);
  config.headers['X-User-ID'] = userId;
  config.headers['X-User-Token'] = token;
  return config;
});

export const todosApi = {
  list: async (): Promise<Todo[]> => {
    const res = await api.get<ListResponse<Todo>>('/todos');
    return res.data.data;
  },

  get: async (id: string): Promise<Todo> => {
    const res = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateTodoPayload): Promise<Todo> => {
    const res = await api.post<ApiResponse<Todo>>('/todos', payload);
    return res.data.data;
  },

  update: async (id: string, payload: UpdateTodoPayload): Promise<Todo> => {
    const res = await api.patch<ApiResponse<Todo>>(`/todos/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  toggleComplete: async (id: string, completed: boolean): Promise<Todo> => {
    const res = await api.patch<ApiResponse<Todo>>(`/todos/${id}`, { completed });
    return res.data.data;
  },
};

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
}
