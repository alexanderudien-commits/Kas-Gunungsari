import React, { useState, useMemo } from 'react';
import { Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Transaction, Budget as BudgetType, CustomCategory } from '../types';
import { DEFAULT_CATEGORIES } from '../types';
import { renderCategoryIcon } from '../utils/icons';

interface BudgetPageProps {
  transactions: Transaction[];
  budgets: BudgetType[];
  customCategories: CustomCategory[];
  onAddBudget: (budget: Omit<BudgetType, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({
  transactions, budgets, customCategories, onAddBudget, onDeleteBudget
}) => {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORIES.expense[0]);
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const allExpenseCategories = useMemo(() => {
    const customs = customCategories.filter(c => c.type === 'expense').map(c => c.name);
    return [...DEFAULT_CATEGORIES.expense, ...customs];
  }, [customCategories]);

  // Calculate spent per budget
  const budgetData = useMemo(() => {
    const now = new Date();
    return budgets.map(b => {
      const start = new Date();
      if (b.period === 'monthly') {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
      } else {
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        start.setHours(0, 0, 0, 0);
      }
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === b.category && new Date(t.date) >= start && new Date(t.date) <= now)
        .reduce((s, t) => s + t.amount, 0);
      const pct = b.limit > 0 ? Math.min((spent / b.limit) * 100, 100) : 0;
      const remaining = Math.max(b.limit - spent, 0);
      const isOver = spent > b.limit;
      return { ...b, spent, pct, remaining, isOver };
    });
  }, [budgets, transactions]);

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);

  const handleAdd = () => {
    const numLimit = Number(limit.replace(/[^0-9]/g, ''));
    if (!numLimit || numLimit <= 0) return;
    onAddBudget({ category, limit: numLimit, period });
    setLimit('');
    setShowForm(false);
  };

  const formatInput = (val: string) => {
    const nums = val.replace(/[^0-9]/g, '');
    if (!nums) return '';
    return Number(nums).toLocaleString('id-ID');
  };

  return (
    <div className="desktop-grid">
      <h2 className="text-headline-lg desktop-full" style={{ color: 'var(--color-on-surface)' }}>Anggaran</h2>

      {/* Overview card */}
      <Card className="desktop-full balance-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-50%', right: '-20%', width: '200px', height: '200px',
          background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 70%)', borderRadius: '50%',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <div className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-xs)' }}>
              TOTAL TERPAKAI
            </div>
            <div className="text-headline-lg" style={{ color: totalSpent > totalBudget ? 'var(--color-secondary)' : 'var(--color-primary)' }}>
              {fmt(totalSpent)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-xs)' }}>
              DARI ANGGARAN
            </div>
            <div className="text-headline-md" style={{ color: 'var(--color-on-surface)' }}>
              {fmt(totalBudget)}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{
          marginTop: 'var(--spacing-md)', height: '6px', borderRadius: '3px',
          backgroundColor: 'var(--color-outline-variant)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: '3px',
            width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%`,
            backgroundColor: totalSpent > totalBudget ? 'var(--color-secondary)' : 'var(--color-primary)',
            transition: 'width 0.5s ease',
          }} />
        </div>
      </Card>

      {/* Budget items */}
      {budgetData.length === 0 && !showForm && (
        <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
          Belum ada anggaran. Tekan tombol "Tambah Anggaran" untuk memulai.
        </div>
      )}

      {budgetData.map(b => (
        <Card key={b.id} padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                backgroundColor: b.isOver ? 'var(--color-secondary-alpha)' : 'var(--color-primary-alpha)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: b.isOver ? 'var(--color-secondary)' : 'var(--color-primary)',
              }}>
                {renderCategoryIcon(b.category, 20, customCategories)}
              </div>
              <div>
                <div className="text-body-lg" style={{ fontWeight: 600 }}>{b.category}</div>
                <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {b.period === 'monthly' ? 'Per bulan' : 'Per minggu'}
                </div>
              </div>
            </div>
            <button onClick={() => setDeleteId(b.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-outline)', padding: '4px',
            }}>
              <Trash2 size={18} />
            </button>
          </div>

          {/* Progress */}
          <div style={{
            height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-surface-container-high)',
            overflow: 'hidden', marginBottom: 'var(--spacing-xs)',
          }}>
            <div style={{
              height: '100%', borderRadius: '4px',
              width: `${b.pct}%`,
              backgroundColor: b.isOver ? 'var(--color-secondary)' : b.pct > 80 ? '#d4a017' : 'var(--color-primary)',
              transition: 'width 0.5s ease',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-body-sm" style={{ color: b.isOver ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)' }}>
              {b.isOver && <AlertCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
              {fmt(b.spent)} terpakai
            </span>
            <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              {fmt(b.remaining)} sisa
            </span>
          </div>
        </Card>
      ))}

      {/* Add Budget Form */}
      {showForm && (
        <Card className="desktop-full">
          <h3 className="text-headline-md" style={{ marginBottom: 'var(--spacing-md)' }}>Anggaran Baru</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{
              width: '100%', height: '44px',
              backgroundColor: 'var(--color-surface-container-low)',
              border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--rounded)',
              color: 'var(--color-on-surface)', padding: '0 var(--spacing-md)',
              fontSize: '14px', outline: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              {allExpenseCategories.map(c => (
                <option key={c} value={c} style={{ backgroundColor: 'var(--color-surface-container)' }}>{c}</option>
              ))}
            </select>

            <input
              type="text" inputMode="numeric" placeholder="Batas anggaran (Rp)"
              value={formatInput(limit)} onChange={e => setLimit(e.target.value)}
              style={{
                width: '100%', height: '44px',
                backgroundColor: 'var(--color-surface-container-low)',
                border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--rounded)',
                color: 'var(--color-on-surface)', padding: '0 var(--spacing-md)',
                fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-outline-variant)'}
            />

            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
              {(['monthly', 'weekly'] as const).map(p => (
                <button key={p} type="button" onClick={() => setPeriod(p)} style={{
                  flex: 1, height: '36px', borderRadius: 'var(--rounded)',
                  cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: period === p ? 'var(--color-primary-alpha)' : 'var(--color-surface-container-low)',
                  color: period === p ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                  border: period === p ? '1.5px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
                  transition: 'all 0.2s',
                }}>
                  {p === 'monthly' ? 'Bulanan' : 'Mingguan'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <Button variant="secondary" onClick={() => setShowForm(false)} style={{ flex: 1, height: '40px', fontSize: '14px' }}>
                Batal
              </Button>
              <Button variant="primary" onClick={handleAdd} style={{ flex: 1, height: '40px', fontSize: '14px' }}>
                Simpan
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="desktop-full">
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> {showForm ? 'TUTUP FORM' : 'TAMBAH ANGGARAN'}
        </Button>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Anggaran"
        message="Apakah Anda yakin ingin menghapus anggaran ini?"
        onConfirm={() => { if (deleteId) onDeleteBudget(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
