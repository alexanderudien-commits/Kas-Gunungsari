import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: '52px',
        height: '32px',
        borderRadius: '16px',
        backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-surface-container-highest)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        display: 'flex',
        alignItems: 'center',
        padding: '4px'
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: checked ? 'var(--color-on-primary)' : 'var(--color-outline)',
          transform: checked ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.3s, background-color 0.3s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {checked && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z" fill="var(--color-primary)"/>
          </svg>
        )}
      </div>
    </div>
  );
};
