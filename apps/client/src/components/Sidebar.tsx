import React from 'react';
import { Wallet, BarChart2, Banknote, Settings, LogOut, Mountain } from 'lucide-react';
import type { User } from '../types';

interface SidebarProps {
  activeTab: string;
  onChange: (tab: string) => void;
  onLogout?: () => void;
  user?: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onChange, onLogout, user }) => {
  const initials = user
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  const tabs = [
    { id: 'ledger', label: 'Dashboard', icon: Wallet },
    { id: 'reports', label: 'Laporan', icon: BarChart2 },
    { id: 'budget', label: 'Anggaran', icon: Banknote },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Mountain size={24} color="var(--color-primary)" strokeWidth={1.5} />
        </div>
        <div className="sidebar-brand-text">
          <span className="text-headline-md" style={{ color: 'var(--color-primary)', fontSize: '16px' }}>
            Kas Gunungsari
          </span>
          <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '11px' }}>
            Desa Wisata
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">MENU UTAMA</div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
            >
              <div className="sidebar-nav-icon">
                <Icon size={20} />
              </div>
              <span>{tab.label}</span>
              {isActive && <div className="sidebar-nav-indicator" />}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {initials || '?'}
          </div>
          <div className="sidebar-user-info">
            <span className="text-body-sm" style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
              {user?.name || 'User'}
            </span>
            <span className="text-body-sm" style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
              {user?.email || ''}
            </span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={onLogout} title="Keluar">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};
