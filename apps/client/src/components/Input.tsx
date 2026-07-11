import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, rightAction, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-base)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="text-label-caps" style={{ color: 'var(--color-on-surface)' }}>
          {label}
        </label>
        {rightAction && <div>{rightAction}</div>}
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{ 
            position: 'absolute', 
            left: 'var(--spacing-md)', 
            color: 'var(--color-outline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            {icon}
          </div>
        )}
        <input
          {...props}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: 'var(--color-surface-container-low)',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: 'var(--rounded)',
            color: 'var(--color-on-surface)',
            padding: `0 var(--spacing-md) 0 ${icon ? '48px' : 'var(--spacing-md)'}`,
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
        />
      </div>
    </div>
  );
};
