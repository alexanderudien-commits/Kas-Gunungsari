import React from 'react';

interface ListItemProps {
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  trailingText?: string;
  trailingTextColor?: string;
  trailingIcon?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const ListItem: React.FC<ListItemProps> = ({
  icon,
  iconBgColor = 'var(--color-surface-container-high)',
  iconColor = 'var(--color-on-surface)',
  title,
  subtitle,
  trailingText,
  trailingTextColor = 'var(--color-on-surface)',
  trailingIcon,
  onClick,
  style
}) => {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--spacing-md) 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--rounded-full)',
          backgroundColor: iconBgColor,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 'var(--spacing-md)',
          flexShrink: 0
        }}>
          {icon}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="text-body-lg" style={{ color: 'var(--color-on-surface)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </div>
        {subtitle && (
          <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {subtitle}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginLeft: 'var(--spacing-md)' }}>
        {trailingText && (
          <div className="text-headline-md" style={{ color: trailingTextColor, whiteSpace: 'nowrap' }}>
            {trailingText}
          </div>
        )}
        {trailingIcon && (
          <div style={{ color: 'var(--color-outline)' }}>
            {trailingIcon}
          </div>
        )}
      </div>
    </div>
  );
};
