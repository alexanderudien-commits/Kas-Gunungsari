import React, { useState, useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import type { TransactionType, CustomCategory } from '../types';
import { DEFAULT_CATEGORIES } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { type: TransactionType; category: string; description: string; amount: number; date: string }) => void;
  customCategories: CustomCategory[];
  editData?: { type: TransactionType; category: string; description: string; amount: number; date: string } | null;
}

const getLocalDatetimeLocal = (d?: string | Date) => {
  const dt = d ? new Date(d) : new Date();
  if (isNaN(dt.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAdd, customCategories, editData }) => {
  const [type, setType] = useState<TransactionType>(editData?.type || 'income');
  const [category, setCategory] = useState(editData?.category || DEFAULT_CATEGORIES.income[0]);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [description, setDescription] = useState(editData?.description || '');
  const [amount, setAmount] = useState(editData ? String(editData.amount) : '');


  const [date, setDate] = useState(getLocalDatetimeLocal(editData?.date));
  const [error, setError] = useState('');

  // Reset form when editData changes
  React.useEffect(() => {
    if (isOpen) {
      setType(editData?.type || 'income');
      setCategory(editData?.category || DEFAULT_CATEGORIES.income[0]);
      setDescription(editData?.description || '');
      setAmount(editData ? String(editData.amount) : '');
      setDate(getLocalDatetimeLocal(editData?.date));
      setError('');
      setShowCustomInput(false);
      setCustomCategoryName('');
    }
  }, [isOpen, editData]);


  const categories = useMemo(() => {
    const defaults = type === 'income' ? [...DEFAULT_CATEGORIES.income] : [...DEFAULT_CATEGORIES.expense];
    const customs = customCategories.filter(c => c.type === type).map(c => c.name);
    return [...defaults, ...customs];
  }, [type, customCategories]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const defaults = newType === 'income' ? DEFAULT_CATEGORIES.income : DEFAULT_CATEGORIES.expense;
    const customs = customCategories.filter(c => c.type === newType).map(c => c.name);
    const allCats = [...defaults, ...customs];
    setCategory(allCats[0]);
    setShowCustomInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount.replace(/[^0-9]/g, ''));
    if (!numAmount || numAmount <= 0) {
      setError('Masukkan jumlah yang valid');
      return;
    }
    if (!description.trim()) {
      setError('Keterangan wajib diisi');
      return;
    }

    const finalCategory = showCustomInput && customCategoryName.trim() 
      ? customCategoryName.trim() 
      : category;

    if (!finalCategory) {
      setError('Pilih atau masukkan kategori');
      return;
    }

    if (!date) {
      setError('Tanggal wajib diisi');
      return;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      setError('Tanggal tidak valid');
      return;
    }

    onAdd({
      type,
      category: finalCategory,
      description: description.trim(),
      amount: numAmount,
      date: d.toISOString(),
    });

    onClose();
  };

  const formatAmount = (val: string) => {
    const nums = val.replace(/[^0-9]/g, '');
    if (!nums) return '';
    return Number(nums).toLocaleString('id-ID');
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div className="modal-content" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'var(--color-surface-container)',
        borderRadius: 'var(--rounded-xl) var(--rounded-xl) 0 0',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: 'none',
        backdropFilter: 'blur(20px)',
        padding: 'var(--spacing-lg)',
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'slideUp 0.3s ease-out',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-sm)' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--color-outline-variant)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h2 className="text-headline-md">{editData ? 'Edit Transaksi' : 'Tambah Transaksi'}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: 'var(--color-on-surface-variant)', cursor: 'pointer', padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Type Selector */}
          <div>
            <label className="text-label-caps" style={{ color: 'var(--color-on-surface)', marginBottom: 'var(--spacing-base)', display: 'block' }}>
              JENIS TRANSAKSI
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              {(['income', 'expense'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  style={{
                    flex: 1, height: '48px', borderRadius: 'var(--rounded)',
                    border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s',
                    backgroundColor: type === t
                      ? (t === 'income' ? 'var(--color-primary-alpha)' : 'var(--color-secondary-alpha)')
                      : 'var(--color-surface-container-low)',
                    color: type === t
                      ? (t === 'income' ? 'var(--color-primary)' : 'var(--color-secondary)')
                      : 'var(--color-on-surface-variant)',
                    outline: type === t
                      ? `2px solid ${t === 'income' ? 'var(--color-primary)' : 'var(--color-secondary)'}`
                      : '1px solid var(--color-outline-variant)',
                  }}
                >
                  {t === 'income' ? '↓ Pemasukan' : '↑ Pengeluaran'}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-label-caps" style={{ color: 'var(--color-on-surface)', marginBottom: 'var(--spacing-base)', display: 'block' }}>
              JUMLAH (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={formatAmount(amount)}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{
                width: '100%', height: '56px',
                backgroundColor: 'var(--color-surface-container-low)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--rounded)',
                color: type === 'income' ? 'var(--color-primary)' : 'var(--color-secondary)',
                padding: '0 var(--spacing-md)', fontSize: '28px', fontWeight: 700,
                outline: 'none', textAlign: 'right',
                fontVariantNumeric: 'tabular-nums', fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = type === 'income' ? 'var(--color-primary)' : 'var(--color-secondary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-outline-variant)'}
            />
          </div>

          {/* Category */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-base)' }}>
              <label className="text-label-caps" style={{ color: 'var(--color-on-surface)' }}>
                KATEGORI
              </label>
              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-primary)', display: 'flex',
                  alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <Plus size={14} /> {showCustomInput ? 'Pilih dari daftar' : 'Kategori baru'}
              </button>
            </div>

            {showCustomInput ? (
              <input
                type="text"
                placeholder="Ketik nama kategori baru..."
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                style={{
                  width: '100%', height: '48px',
                  backgroundColor: 'var(--color-surface-container-low)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: 'var(--rounded)',
                  color: 'var(--color-on-surface)',
                  padding: '0 var(--spacing-md)', fontSize: '16px', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%', height: '48px',
                  backgroundColor: 'var(--color-surface-container-low)',
                  border: '1px solid var(--color-outline-variant)',
                  borderRadius: 'var(--rounded)',
                  color: 'var(--color-on-surface)',
                  padding: '0 var(--spacing-md)', fontSize: '16px',
                  outline: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c} style={{ backgroundColor: 'var(--color-surface-container)' }}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <Input
            label="KETERANGAN"
            type="text"
            placeholder="Contoh: Tiket masuk wisatawan"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* Date */}
          <div>
            <label className="text-label-caps" style={{ color: 'var(--color-on-surface)', marginBottom: 'var(--spacing-base)', display: 'block' }}>
              TANGGAL & WAKTU
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%', height: '48px',
                backgroundColor: 'var(--color-surface-container-low)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--rounded)',
                color: 'var(--color-on-surface)',
                padding: '0 var(--spacing-md)', fontSize: '16px',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-secondary-alpha)',
              border: '1px solid var(--color-secondary)',
              borderRadius: 'var(--rounded)',
              color: 'var(--color-secondary)', textAlign: 'center',
            }} className="text-body-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant={type === 'income' ? 'primary' : 'expense'}
            style={type === 'expense' ? { backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' } : undefined}
          >
            {editData
              ? '✓ SIMPAN PERUBAHAN'
              : type === 'income'
                ? '+ SIMPAN PEMASUKAN'
                : '- SIMPAN PENGELUARAN'}
          </Button>
        </form>
      </div>
    </div>
  );
};
