import React from 'react';

interface ErrorMsgProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMsg: React.FC<ErrorMsgProps> = ({ message, onRetry }) => (
  <div style={{ color: '#dc2626', padding: '8px 12px', background: '#fef2f2', borderRadius: 6, marginBottom: 12 }}>
    <strong>出错了：</strong> {message}
    {onRetry && (
      <button onClick={onRetry} style={{ marginLeft: 12, cursor: 'pointer' }}>
        重试
      </button>
    )}
  </div>
);
