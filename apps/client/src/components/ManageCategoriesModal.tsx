import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';
import type { CustomCategory, TransactionType } from '../types';
import { AVAILABLE_ICONS } from '../types';
import { getIconComponent } from '../utils/icons';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCategories: CustomCategory[];
  onAddCategory: (cat: Omit<CustomCategory, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  isOpen, onClose, customCategories, onAddCategory, onDeleteCategory
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [selectedIcon, setSelectedIcon] = useState('MoreHorizontal');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    setError('');
    if (!name.trim()) { setError('Nama kategori wajib diisi'); return; }
    if (customCategories.find(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('Kategori sudah ada');
      return;
    }
    onAddCategory({ name: name.trim(), type, icon: selectedIcon });
    setName('');
    setSelectedIcon('MoreHorizontal');
    setError('');
  };

  const incomeCustom = customCategories.filter(c => c.type === 'income');
  const expenseCustom = customCategories.filter(c => c.type === 'expense');

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
      }} />

      <div className="modal-content" style={{
        position: 'relative', width: '100%', maxWidth: '500px',
        backgroundColor: 'var(--color-surface-container)',
        borderRadius: 'var(--rounded-xl) var(--rounded-xl) 0 0',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: 'none', backdropFilter: 'blur(20px)',
        padding: 'var(--spacing-lg)', maxHeight: '90vh', overflowY: 'auto',
        animation: 'slideUp 0.3s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-sm)' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--color-outline-variant)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h2 className="text-headline-md">Kelola Kategori</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-on-surface-variant)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Add New Category */}
        <div className="glass-card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
          <label className="text-label-caps" style={{ color: 'var(--color-on-surface)', marginBottom: 'var(--spacing-xs)', display: 'block' }}>
            TAMBAH KATEGORI BARU
          </label>

          {/* Type selector */}
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
            {(['income', 'expense'] as TransactionType[]).map(t => (
              <button key={t} type="button" onClick={() => setType(t)} style={{
                flex: 1, height: '36px', borderRadius: 'var(--rounded)',
                border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                backgroundColor: type === t
                  ? (t === 'income' ? 'rgba(78,222,163,0.2)' : 'rgba(255,178,183,0.2)')
                  : 'rgba(9,16,12,0.5)',
                color: type === t ? (t === 'income' ? 'var(--color-primary)' : '#ffb2b7') : 'var(--color-on-surface-variant)',
                outline: type === t ? `1.5px solid ${t === 'income' ? 'var(--color-primary)' : '#ffb2b7'}` : '1px solid var(--color-outline-variant)',
              }}>
                {t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </button>
            ))}
          </div>

          {/* Name input */}
          <input
            placeholder="Nama kategori..."
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%', height: '40px', backgroundColor: 'rgba(9,16,12,0.5)',
              border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--rounded)',
              color: 'var(--color-on-surface)', padding: '0 var(--spacing-md)',
              fontSize: '14px', outline: 'none', marginBottom: 'var(--spacing-sm)',
              fontFamily: 'Inter, sans-serif',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-outline-variant)'}
          />

          {/* Icon selector */}
          <label className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)', marginBottom: '6px', display: 'block', fontSize: '10px' }}>
            PILIH IKON
          </label>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--spacing-sm)',
            maxHeight: '120px', overflowY: 'auto', padding: '2px',
          }}>
            {AVAILABLE_ICONS.map(iconName => {
              const Icon = getIconComponent(iconName);
              const isSelected = selectedIcon === iconName;
              return (
                <button key={iconName} type="button" onClick={() => setSelectedIcon(iconName)} style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  backgroundColor: isSelected ? 'rgba(78,222,163,0.2)' : 'transparent',
                  border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          {error && (
            <div className="text-body-sm" style={{
              color: '#ffb2b7', marginBottom: 'var(--spacing-sm)', textAlign: 'center',
            }}>{error}</div>
          )}

          <Button variant="primary" onClick={handleAdd} style={{ height: '40px', fontSize: '14px' }}>
            <Plus size={16} /> Tambah Kategori
          </Button>
        </div>

        {/* Existing custom categories */}
        {customCategories.length > 0 && (
          <>
            {incomeCustom.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 className="text-label-caps" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)' }}>
                  PEMASUKAN KUSTOM
                </h4>
                {incomeCustom.map(cat => {
                  const Icon = getIconComponent(cat.icon);
                  return (
                    <div key={cat.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: 'var(--spacing-sm) 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '8px',
                          backgroundColor: 'rgba(78,222,163,0.1)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)',
                        }}>
                          <Icon size={16} />
                        </div>
                        <span className="text-body-lg">{cat.name}</span>
                      </div>
                      <button onClick={() => onDeleteCategory(cat.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--color-outline)', padding: '4px',
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {expenseCustom.length > 0 && (
              <div>
                <h4 className="text-label-caps" style={{ color: '#ffb2b7', marginBottom: 'var(--spacing-xs)' }}>
                  PENGELUARAN KUSTOM
                </h4>
                {expenseCustom.map(cat => {
                  const Icon = getIconComponent(cat.icon);
                  return (
                    <div key={cat.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: 'var(--spacing-sm) 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '8px',
                          backgroundColor: 'rgba(255,178,183,0.1)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', color: '#ffb2b7',
                        }}>
                          <Icon size={16} />
                        </div>
                        <span className="text-body-lg">{cat.name}</span>
                      </div>
                      <button onClick={() => onDeleteCategory(cat.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--color-outline)', padding: '4px',
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {customCategories.length === 0 && (
          <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: 'var(--spacing-md)' }}>
            Belum ada kategori kustom. Tambahkan di atas!
          </div>
        )}
      </div>
    </div>
  );
};
