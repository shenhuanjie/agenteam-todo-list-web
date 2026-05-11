import React from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, deletingId }) => {
  const isDeleting = deletingId === todo.id;

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px',
        borderBottom: '1px solid #eee',
        opacity: isDeleting ? 0.5 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        style={{ marginTop: 3, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 500,
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#999' : '#222',
          }}
        >
          {todo.title}
        </div>
        {todo.description && (
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{todo.description}</div>
        )}
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        disabled={isDeleting}
        style={{
          background: 'none',
          border: 'none',
          color: '#dc2626',
          cursor: isDeleting ? 'not-allowed' : 'pointer',
          flexShrink: 0,
        }}
      >
        删除
      </button>
    </li>
  );
};
