import React from 'react';
import { Wallet, BarChart2, Banknote, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'ledger', label: 'Ledger', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'budget', label: 'Budget', icon: Banknote },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '72px',
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <div 
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '100%',
              cursor: 'pointer',
              color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '32px',
              borderRadius: '16px',
              backgroundColor: isActive ? 'rgba(78, 222, 163, 0.2)' : 'transparent',
              marginBottom: '4px',
              transition: 'background-color 0.2s',
            }}>
              <Icon size={20} />
            </div>
            <span className="text-label-caps" style={{ 
              fontSize: '10px', 
              textTransform: 'none',
              fontWeight: isActive ? 600 : 400
            }}>
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
