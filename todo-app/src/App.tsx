import { useState, useEffect, useCallback } from 'react';
import { todosApi } from './api/todos';
import type { Todo, CreateTodoPayload } from './types/todo';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import { Loading } from './components/Loading';
import { ErrorMsg } from './components/ErrorMsg';
import './index.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todosApi.list();
      setTodos(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? err?.message ?? '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreate = async (payload: CreateTodoPayload) => {
    setSubmitting(true);
    try {
      const newTodo = await todosApi.create(payload);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err: any) {
      alert(err?.response?.data?.detail ?? err?.message ?? '创建失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updated = await todosApi.toggleComplete(id, completed);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: any) {
      alert(err?.response?.data?.detail ?? err?.message ?? '更新失败');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await todosApi.delete(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.detail ?? err?.message ?? '删除失败');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📋 TODO</h1>
      </header>

      <main className="app-main">
        <TodoForm onSubmit={handleCreate} loading={submitting} />

        {error && <ErrorMsg message={error} onRetry={fetchTodos} />}

        {loading ? (
          <Loading />
        ) : (
          <>
            {todos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                还没有 TODO，添加一个吧～
              </p>
            ) : (
              <ul className="todo-list">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
