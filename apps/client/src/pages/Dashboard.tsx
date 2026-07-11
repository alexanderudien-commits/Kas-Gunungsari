import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ListItem } from '../components/ListItem';
import { Chip } from '../components/Chip';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Transaction, TransactionType, CustomCategory } from '../types';
import { renderCategoryIcon } from '../utils/icons';

interface DashboardProps {
  transactions: Transaction[];
  customCategories: CustomCategory[];
  onAddTransaction: (data: { type: TransactionType; category: string; description: string; amount: number; date: string }) => void;
  onDeleteTransaction: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, customCategories, onAddTransaction, onDeleteTransaction, onNavigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  const percentChange = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : '0';

  const fmt = (n: number) => 'Rp ' + Math.abs(n).toLocaleString('id-ID');
  const fmtShort = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return 'Rp ' + (abs / 1_000_000).toFixed(1) + 'jt';
    if (abs >= 1_000) return 'Rp ' + (abs / 1_000).toFixed(0) + 'rb';
    return 'Rp ' + abs;
  };

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recent = sorted.slice(0, 5);

  // Dynamic Chart Data
  const now = new Date();
  const chartData: { label: string; income: number; expense: number }[] = [];
  
  if (chartTimeframe === 'daily') {
    // Today: 4 segments (00-06, 06-12, 12-18, 18-24)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const segments = [
      { label: '00-06', startHour: 0, endHour: 6 },
      { label: '06-12', startHour: 6, endHour: 12 },
      { label: '12-18', startHour: 12, endHour: 18 },
      { label: '18-24', startHour: 18, endHour: 24 }
    ];
    segments.forEach(seg => {
      const start = new Date(today.getTime() + seg.startHour * 3600000);
      const end = new Date(today.getTime() + seg.endHour * 3600000);
      chartData.push({
        label: seg.label,
        income: transactions.filter(t => t.type === 'income' && new Date(t.date) >= start && new Date(t.date) < end).reduce((s, t) => s + t.amount, 0),
        expense: transactions.filter(t => t.type === 'expense' && new Date(t.date) >= start && new Date(t.date) < end).reduce((s, t) => s + t.amount, 0),
      });
    });
  } else if (chartTimeframe === 'weekly') {
    // This Week: Monday to Sunday
    const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const currentDay = now.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Distance to Monday
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
    
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      chartData.push({
        label: dayLabels[i],
        income: transactions.filter(t => t.type === 'income' && new Date(t.date) >= dayStart && new Date(t.date) < dayEnd).reduce((s, t) => s + t.amount, 0),
        expense: transactions.filter(t => t.type === 'expense' && new Date(t.date) >= dayStart && new Date(t.date) < dayEnd).reduce((s, t) => s + t.amount, 0),
      });
    }
  } else if (chartTimeframe === 'monthly') {
    // This Month: Week 1 to Week 5
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const weeks = Math.ceil(daysInMonth / 7);
    
    for (let i = 0; i < weeks; i++) {
      const startDay = i * 7 + 1;
      const endDay = Math.min((i + 1) * 7, daysInMonth);
      const start = new Date(now.getFullYear(), now.getMonth(), startDay);
      const end = new Date(now.getFullYear(), now.getMonth(), endDay + 1); // +1 to include end day
      chartData.push({
        label: `M${i + 1}`,
        income: transactions.filter(t => t.type === 'income' && new Date(t.date) >= start && new Date(t.date) < end).reduce((s, t) => s + t.amount, 0),
        expense: transactions.filter(t => t.type === 'expense' && new Date(t.date) >= start && new Date(t.date) < end).reduce((s, t) => s + t.amount, 0),
      });
    }
  } else if (chartTimeframe === 'yearly') {
    // This Year: Jan to Dec
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    for (let i = 0; i < 12; i++) {
      const start = new Date(now.getFullYear(), i, 1);
      const end = new Date(now.getFullYear(), i + 1, 1);
      chartData.push({
        label: monthLabels[i],
        income: transactions.filter(t => t.type === 'income' && new Date(t.date) >= start && new Date(t.date) < end).reduce((s, t) => s + t.amount, 0),
        expense: transactions.filter(t => t.type === 'expense' && new Date(t.date) >= start && new Date(t.date) < end).reduce((s, t) => s + t.amount, 0),
      });
    }
  }

  const maxChart = Math.max(...chartData.map(d => Math.max(d.income, d.expense)), 1);
  const chartW = 300; const chartH = 100;
  const buildPath = (values: number[], close: boolean): string => {
    const step = chartW / (values.length - 1);
    let path = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * step},${chartH - (v / maxChart) * chartH * 0.8}`).join(' ');
    if (close) path += ` L${chartW},${chartH} L0,${chartH} Z`;
    return path;
  };

  return (
    <div className="desktop-grid">
      {/* Balance Card — full width */}
      <Card className="desktop-full balance-card" style={{
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50%', right: '-20%', width: '200px', height: '200px',
          background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 70%)', borderRadius: '50%',
        }} />
        <div className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-xs)' }}>
          SALDO BERSIH
        </div>
        <div className="text-numeric-xl" style={{ color: balance >= 0 ? 'var(--color-on-surface)' : 'var(--color-secondary)', marginBottom: 'var(--spacing-sm)' }}>
          {balance < 0 ? '-' : ''}{fmt(balance)}
        </div>
        <Chip label={`↗ ${balance >= 0 ? '+' : ''}${percentChange}%`} active variant="outline" />
      </Card>

      {/* Summary cards — each takes 1 column on desktop */}
      <Card style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
          <ArrowDownRight size={16} color="var(--color-primary)" />
          <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>PEMASUKAN</span>
        </div>
        <div className="text-headline-md" style={{ color: 'var(--color-on-surface)', marginBottom: 'var(--spacing-base)' }}>{fmtShort(totalIncome)}</div>
        <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{incomeCount} transaksi</div>
      </Card>
      <Card style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
          <ArrowUpRight size={16} color="var(--color-secondary)" />
          <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>PENGELUARAN</span>
        </div>
        <div className="text-headline-md" style={{ color: 'var(--color-on-surface)', marginBottom: 'var(--spacing-base)' }}>{fmtShort(totalExpense)}</div>
        <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{expenseCount} transaksi</div>
      </Card>

      {/* Chart */}
      <Card className="desktop-full">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h3 className="text-headline-md">Arus Kas</h3>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--color-surface-container-high)', padding: '4px', borderRadius: 'var(--rounded)', border: '1px solid var(--color-outline-variant)' }}>
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(t => (
              <button
                key={t}
                onClick={() => setChartTimeframe(t)}
                style={{
                  background: chartTimeframe === t ? 'var(--color-primary-alpha)' : 'transparent',
                  color: chartTimeframe === t ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                  border: chartTimeframe === t ? '1px solid var(--color-primary)' : '1px solid transparent',
                  borderRadius: '4px', padding: '4px 8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
                }}
              >
                {t === 'daily' ? 'Harian' : t === 'weekly' ? 'Mingguan' : t === 'monthly' ? 'Bulanan' : 'Tahunan'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: '160px', width: '100%', position: 'relative', marginTop: 'var(--spacing-md)' }}>
          {/* Y-Axis Grid & Labels */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '20%', left: 0, width: '100%', borderTop: '1px dashed var(--color-outline-variant)' }} />
            <div style={{ position: 'absolute', top: '20%', left: '2px', transform: 'translateY(-120%)', fontSize: '10px', fontWeight: 600, color: 'var(--color-on-surface-variant)', textShadow: '0 1px 4px var(--color-surface), 0 -1px 4px var(--color-surface)' }}>{fmtShort(maxChart)}</div>
            
            <div style={{ position: 'absolute', top: '60%', left: 0, width: '100%', borderTop: '1px dashed var(--color-outline-variant)' }} />
            <div style={{ position: 'absolute', top: '60%', left: '2px', transform: 'translateY(-120%)', fontSize: '10px', fontWeight: 600, color: 'var(--color-on-surface-variant)', textShadow: '0 1px 4px var(--color-surface), 0 -1px 4px var(--color-surface)' }}>{fmtShort(maxChart / 2)}</div>
            
            <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', borderTop: '1px dashed var(--color-outline-variant)' }} />
          </div>

          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox={`0 0 ${chartW} ${chartH}`} style={{ overflow: 'visible' }}>
            <path d={buildPath(chartData.map(d => d.income), true)} fill="var(--color-primary-alpha)" />
            <path d={buildPath(chartData.map(d => d.income), false)} fill="none" stroke="var(--color-primary)" strokeWidth="2" />
            <path d={buildPath(chartData.map(d => d.expense), true)} fill="var(--color-secondary-alpha)" />
            <path d={buildPath(chartData.map(d => d.expense), false)} fill="none" stroke="var(--color-secondary)" strokeWidth="2" />
          </svg>

          {/* Data Points Interactive Overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {chartData.map((d, i) => {
              const xPct = chartData.length > 1 ? (i / (chartData.length - 1)) * 100 : 50;
              return (
                <React.Fragment key={i}>
                  {/* Income point */}
                  <div 
                    title={`${d.label} - Pemasukan: ${fmt(d.income)}`}
                    style={{
                      position: 'absolute', left: `${xPct}%`, top: `${(1 - (d.income / maxChart) * 0.8) * 100}%`,
                      width: '12px', height: '12px', borderRadius: '6px',
                      backgroundColor: 'var(--color-primary)', border: '2px solid var(--color-surface-container)',
                      transform: 'translate(-50%, -50%)', pointerEvents: 'auto', cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.5)', transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.5)'; e.currentTarget.style.boxShadow = '0 4px 8px var(--color-primary-alpha)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.5)'; }}
                  />
                  {/* Expense point */}
                  <div 
                    title={`${d.label} - Pengeluaran: ${fmt(d.expense)}`}
                    style={{
                      position: 'absolute', left: `${xPct}%`, top: `${(1 - (d.expense / maxChart) * 0.8) * 100}%`,
                      width: '12px', height: '12px', borderRadius: '6px',
                      backgroundColor: 'var(--color-secondary)', border: '2px solid var(--color-surface-container)',
                      transform: 'translate(-50%, -50%)', pointerEvents: 'auto', cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.5)', transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.5)'; e.currentTarget.style.boxShadow = '0 4px 8px var(--color-secondary-alpha)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.5)'; }}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', color: 'var(--color-on-surface-variant)' }} className="text-body-sm">
          {chartData.map((d, i) => <span key={i}>{d.label}</span>)}
        </div>
        <div className="flex-center" style={{ gap: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-primary)' }} />
            <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Masuk</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-secondary)' }} />
            <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Keluar</span>
          </div>
        </div>
      </Card>

      {/* Add button — full width */}
      <div className="desktop-full">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> TAMBAH TRANSAKSI
        </Button>
      </div>

      {/* Recent Transactions — full width */}
      <Card className="desktop-full" padding="none" style={{ padding: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h3 className="text-headline-md">Transaksi Terakhir</h3>
          {transactions.length > 5 && (
            <span className="text-body-sm" style={{ color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => onNavigate('transactions')}>
              Lihat Semua →
            </span>
          )}
        </div>
        {recent.length === 0 ? (
          <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: 'var(--spacing-lg) 0' }}>
            Belum ada transaksi. Tekan "Tambah Transaksi" di atas.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recent.map((tx, idx) => {
              const isIncome = tx.type === 'income';
              const timeStr = new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
              return (
                <ListItem
                  key={tx.id}
                  icon={renderCategoryIcon(tx.category, 20, customCategories)}
                  iconColor={isIncome ? 'var(--color-primary)' : '#ffb2b7'}
                  iconBgColor={isIncome ? 'rgba(78, 222, 163, 0.1)' : 'rgba(255, 178, 183, 0.1)'}
                  title={tx.description}
                  subtitle={`${tx.category} · ${timeStr}`}
                  trailingText={`${isIncome ? '+' : '-'}${fmt(tx.amount)}`}
                  trailingTextColor={isIncome ? 'var(--color-primary)' : '#ffb2b7'}
                  trailingIcon={
                    <div onClick={(e) => { e.stopPropagation(); setDeleteId(tx.id); }} style={{ cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </div>
                  }
                  style={idx === recent.length - 1 ? { borderBottom: 'none' } : undefined}
                />
              );
            })}
          </div>
        )}
      </Card>

      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={onAddTransaction}
        customCategories={customCategories}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Transaksi"
        message="Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak bisa dibatalkan."
        onConfirm={() => { if (deleteId) onDeleteTransaction(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
