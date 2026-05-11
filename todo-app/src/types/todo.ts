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
