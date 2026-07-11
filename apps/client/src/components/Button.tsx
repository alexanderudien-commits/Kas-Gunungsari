import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'expense';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  let backgroundColor = 'var(--color-primary)';
  let color = 'var(--color-on-primary)';
  let border = 'none';

  if (variant === 'secondary') {
    backgroundColor = 'transparent';
    color = 'var(--color-primary)';
    border = '1px solid var(--color-primary)';
  } else if (variant === 'expense') {
    backgroundColor = 'var(--color-secondary-container)';
    color = 'var(--color-on-secondary-container)';
  }

  return (
    <button
      {...props}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-xs)',
        width: '100%',
        height: '48px',
        backgroundColor,
        color,
        border,
        borderRadius: 'var(--rounded)',
        fontSize: '16px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
        ...props.style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </button>
  );
};
