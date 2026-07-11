import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, title, message, confirmLabel = 'Hapus', cancelLabel = 'Batal',
  variant = 'danger', onConfirm, onCancel
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
      }} />

      <div style={{
        position: 'relative', width: '90%', maxWidth: '360px',
        backgroundColor: 'var(--color-surface-container-high)',
        borderRadius: 'var(--rounded-xl)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 'var(--spacing-lg)',
        animation: 'fadeIn 0.2s ease-out',
        textAlign: 'center',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '24px',
          backgroundColor: isDanger ? 'rgba(255, 178, 183, 0.15)' : 'rgba(78, 222, 163, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--spacing-md)',
        }}>
          <AlertTriangle size={24} color={isDanger ? '#ffb2b7' : 'var(--color-primary)'} />
        </div>

        <h3 className="text-headline-md" style={{ marginBottom: 'var(--spacing-xs)' }}>{title}</h3>
        <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-lg)' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button onClick={onCancel} style={{
            flex: 1, height: '44px', borderRadius: 'var(--rounded)',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-outline-variant)',
            color: 'var(--color-on-surface)', cursor: 'pointer',
            fontWeight: 600, fontSize: '14px', fontFamily: 'Inter, sans-serif',
          }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, height: '44px', borderRadius: 'var(--rounded)',
            backgroundColor: isDanger ? 'rgba(255, 178, 183, 0.2)' : 'rgba(78, 222, 163, 0.2)',
            border: `1px solid ${isDanger ? 'rgba(255,178,183,0.3)' : 'rgba(78,222,163,0.3)'}`,
            color: isDanger ? '#ffb2b7' : 'var(--color-primary)',
            cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: 'Inter, sans-serif',
          }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
