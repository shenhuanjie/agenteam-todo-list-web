import React, { useState } from 'react';
import type { CreateTodoPayload } from '../types/todo';

interface TodoFormProps {
  onSubmit: (payload: CreateTodoPayload) => void;
  loading: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        marginBottom: 24,
      }}
    >
      <input
        type="text"
        placeholder="标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: 6,
          fontSize: 15,
        }}
      />
      <textarea
        placeholder="描述（可选）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        style={{
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: 6,
          fontSize: 15,
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        style={{
          padding: '8px 16px',
          background: loading ? '#9ca3af' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 15,
        }}
      >
        {loading ? '添加中...' : '添加 TODO'}
      </button>
    </form>
  );
};
