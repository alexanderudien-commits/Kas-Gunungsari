import React, { useState } from 'react';
import { Edit2, Moon, Bell, Globe, ChevronRight, Tags, RefreshCw, Download, LogOut, Plus, Check, X } from 'lucide-react';
import { Card } from '../components/Card';
import { ListItem } from '../components/ListItem';
import { Toggle } from '../components/Toggle';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { User } from '../types';
import { updateUserProfile } from '../store';

interface SettingsProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
  onOpenCategories: () => void;
  darkTheme: boolean;
  setDarkTheme: (val: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout, onUserUpdate, onOpenCategories, darkTheme, setDarkTheme }) => {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) return;
    const updated = await updateUserProfile(user.id, { name: editName.trim(), email: editEmail.trim() });
    if (updated) {
      onUserUpdate(updated);
      setEditingProfile(false);
      setSaveMsg('Profil berhasil diperbarui!');
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handleExport = () => {
    const allData = {
      transactions: localStorage.getItem('kas_gunungsari_transactions'),
      categories: localStorage.getItem('kas_gunungsari_custom_categories'),
      budgets: localStorage.getItem('kas_gunungsari_budgets'),
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_kas_gunungsari_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="desktop-grid">
      {/* Success message */}
      {saveMsg && (
        <div style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: 'rgba(78, 222, 163, 0.1)',
          border: '1px solid rgba(78, 222, 163, 0.2)',
          borderRadius: 'var(--rounded)', color: 'var(--color-primary)',
          textAlign: 'center', animation: 'fadeIn 0.2s ease-out',
        }} className="text-body-sm desktop-full">
          <Check size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{saveMsg}
        </div>
      )}

      {/* Profile Card */}
      <Card className="desktop-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-xl)' }}>
        <div style={{ position: 'relative', marginBottom: 'var(--spacing-md)' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a2a22 0%, #09100c 100%)',
            border: '2px solid var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-primary)',
          }}>
            <span className="text-headline-lg">{initials}</span>
          </div>
          <div
            onClick={() => { setEditingProfile(!editingProfile); setEditName(user.name); setEditEmail(user.email); }}
            style={{
              position: 'absolute', bottom: '0', right: '0',
              width: '28px', height: '28px', borderRadius: '14px',
              backgroundColor: 'var(--color-surface-bright)',
              border: '2px solid var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-on-surface-variant)', cursor: 'pointer',
            }}
          >
            <Edit2 size={12} />
          </div>
        </div>

        {editingProfile ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <Input label="Nama" type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nama lengkap" />
            <Input label="Email" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Email" />
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)' }}>
              <Button variant="secondary" onClick={() => setEditingProfile(false)} style={{ flex: 1, height: '40px', fontSize: '14px' }}>
                <X size={16} /> Batal
              </Button>
              <Button variant="primary" onClick={handleSaveProfile} style={{ flex: 1, height: '40px', fontSize: '14px' }}>
                <Check size={16} /> Simpan
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-headline-md" style={{ marginBottom: '4px' }}>{user.name}</h2>
            <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-md)' }}>
              {user.email}
            </p>
            <div className="text-label-caps" style={{
              backgroundColor: 'rgba(78, 222, 163, 0.1)', color: 'var(--color-primary)',
              padding: '6px 12px', borderRadius: '16px', textTransform: 'none',
            }}>
              Pro Plan Active
            </div>
          </>
        )}
      </Card>

      {/* Preferences */}
      <Card padding="none" style={{ padding: '0 var(--spacing-md)' }}>
        <h3 className="text-headline-md" style={{ padding: 'var(--spacing-md) 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          Preferensi
        </h3>
        <ListItem
          icon={<Moon size={20} />} iconBgColor="transparent" iconColor="var(--color-primary)"
          title="Tema Gelap" trailingIcon={<Toggle checked={darkTheme} onChange={setDarkTheme} />}
        />
        <ListItem
          icon={<Bell size={20} />} iconBgColor="transparent" iconColor="var(--color-primary)"
          title="Notifikasi" subtitle="Ringkasan harian & peringatan"
          trailingIcon={<Toggle checked={pushNotifs} onChange={setPushNotifs} />}
        />
        <ListItem
          icon={<Globe size={20} />} iconBgColor="transparent" iconColor="var(--color-primary)"
          title="Bahasa" trailingText="Indonesia"
          trailingTextColor="var(--color-on-surface-variant)" trailingIcon={<ChevronRight size={20} />}
          style={{ borderBottom: 'none' }}
        />
      </Card>

      {/* Data Management */}
      <Card padding="none" style={{ padding: '0 var(--spacing-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-md) 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 className="text-headline-md">Manajemen Data</h3>
        </div>
        <ListItem
          icon={<Tags size={20} />} iconBgColor="transparent" iconColor="var(--color-primary)"
          title="Kelola Kategori" subtitle="Tambah/hapus kategori kustom"
          trailingIcon={<ChevronRight size={20} />}
          onClick={onOpenCategories}
        />
        <ListItem
          icon={<RefreshCw size={20} />} iconBgColor="transparent" iconColor="var(--color-primary)"
          title="Backup & Sinkronisasi" subtitle={`Terakhir: ${new Date().toLocaleDateString('id-ID')}`}
          trailingIcon={<ChevronRight size={20} />}
        />
        <ListItem
          icon={<Download size={20} />} iconBgColor="transparent" iconColor="var(--color-primary)"
          title="Ekspor Seluruh Data" subtitle="Download backup JSON"
          trailingIcon={<ChevronRight size={20} />}
          style={{ borderBottom: 'none' }}
          onClick={handleExport}
        />
      </Card>

      <Button
        variant="expense"
        style={{ backgroundColor: 'rgba(255, 178, 183, 0.1)', color: '#ffb2b7', border: '1px solid rgba(255, 178, 183, 0.2)' }}
        onClick={() => setShowLogoutConfirm(true)}
      >
        <LogOut size={20} /> Keluar dari Akun
      </Button>

      <div style={{ textAlign: 'center', color: 'var(--color-outline)', marginTop: 'var(--spacing-md)' }} className="text-body-sm">
        Kas Gunungsari App v2.2.0
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Keluar dari Akun"
        message="Anda yakin ingin keluar? Data Anda tetap tersimpan di perangkat ini."
        confirmLabel="Keluar"
        variant="danger"
        onConfirm={() => { setShowLogoutConfirm(false); onLogout(); }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};
