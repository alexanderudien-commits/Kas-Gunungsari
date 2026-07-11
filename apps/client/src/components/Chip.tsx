import React from 'react';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: 'outline' | 'filled';
}

export const Chip: React.FC<ChipProps> = ({ label, active = false, onClick, variant = 'outline' }) => {
  const isOutline = variant === 'outline';
  
  const bgColor = active 
    ? (isOutline ? 'rgba(78, 222, 163, 0.1)' : 'var(--color-primary)') 
    : 'transparent';
    
  const color = active 
    ? (isOutline ? 'var(--color-primary)' : 'var(--color-on-primary)') 
    : 'var(--color-on-surface-variant)';
    
  const border = active && isOutline
    ? '1px solid var(--color-primary)'
    : '1px solid var(--color-outline-variant)';

  return (
    <button
      onClick={onClick}
      className="text-label-caps"
      style={{
        padding: 'var(--spacing-xs) var(--spacing-md)',
        borderRadius: 'var(--rounded-full)',
        backgroundColor: bgColor,
        color: color,
        border: border,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        textTransform: 'none', // Override caps if needed
      }}
    >
      {label}
    </button>
  );
};
