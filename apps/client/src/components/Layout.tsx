import React from 'react';
import { LogOut } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import type { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  user?: User | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onLogout, user }) => {
  const initials = user
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <div className="app-shell">
      {/* Desktop Sidebar — hidden on mobile via CSS */}
      <Sidebar
        activeTab={activeTab}
        onChange={onTabChange}
        onLogout={onLogout}
        user={user}
      />

      {/* Main content area */}
      <div className="app-main">
        {/* Mobile Header — hidden on desktop via CSS */}
        <div className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '16px',
              background: user ? 'linear-gradient(135deg, #1a2a22, #09100c)' : 'var(--color-surface-container-high)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: user ? '1.5px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
              overflow: 'hidden', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 700,
            }}>
              {initials || (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-on-surface)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
            <h1 className="text-headline-md" style={{ color: 'var(--color-primary)' }}>
              Kas Gunungsari
            </h1>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'none', border: 'none',
              color: 'var(--color-on-surface-variant)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <LogOut size={24} />
          </button>
        </div>

        {/* Desktop Header — hidden on mobile via CSS */}
        <div className="desktop-header">
          <div>
            <h1 className="text-headline-lg" style={{ color: 'var(--color-on-surface)', marginBottom: '2px' }}>
              {activeTab === 'ledger' && 'Dashboard'}
              {activeTab === 'reports' && 'Laporan Keuangan'}
              {activeTab === 'budget' && 'Anggaran'}
              {activeTab === 'settings' && 'Pengaturan'}
              {activeTab === 'transactions' && 'Riwayat Transaksi'}
            </h1>
            <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
            backgroundColor: 'var(--color-surface-container-low)',
            padding: '8px 16px',
            borderRadius: 'var(--rounded-full)',
            border: '1px solid var(--color-outline-variant)',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--color-primary-container), var(--color-primary-alpha))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid var(--color-primary)',
              color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700,
            }}>
              {initials}
            </div>
            <span className="text-body-sm" style={{ fontWeight: 600 }}>{user?.name}</span>
          </div>
          </div>
        </div>

        {/* Content */}
        <div className="app-content">
          {children}
        </div>

        {/* Mobile Bottom Nav — hidden on desktop via CSS */}
        <div className="mobile-bottom-nav">
          <BottomNav activeTab={activeTab} onChange={onTabChange} />
        </div>
      </div>
    </div>
  );
};
