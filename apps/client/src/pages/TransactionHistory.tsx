import React, { useState, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { ListItem } from '../components/ListItem';
import { Chip } from '../components/Chip';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Transaction, CustomCategory } from '../types';
import { renderCategoryIcon } from '../utils/icons';

interface TransactionHistoryProps {
  transactions: Transaction[];
  customCategories: CustomCategory[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, customCategories, onDeleteTransaction }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const filtered = useMemo(() => {
    let list = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (filter === 'income') list = list.filter(t => t.type === 'income');
    if (filter === 'expense') list = list.filter(t => t.type === 'expense');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    return list;
  }, [transactions, filter, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

    filtered.forEach((tx) => {
      const txDate = new Date(tx.date); txDate.setHours(0, 0, 0, 0);
      let label: string;
      if (txDate.getTime() === today.getTime()) label = 'Hari Ini';
      else if (txDate.getTime() === yesterday.getTime()) label = 'Kemarin';
      else label = txDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (!groups[label]) groups[label] = [];
      groups[label].push(tx);
    });
    return groups;
  }, [filtered]);

  // Summary stats for filtered items
  const totalFiltered = filtered.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 'var(--spacing-md)', top: '14px', color: 'var(--color-outline)' }}>
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', height: '48px', backgroundColor: 'rgba(9, 16, 12, 0.5)',
            border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--rounded)',
            color: 'var(--color-on-surface)', padding: '0 var(--spacing-md) 0 48px',
            fontSize: '16px', outline: 'none', fontFamily: 'Inter, sans-serif',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
        <Chip label="Semua" active={filter === 'all'} variant="outline" onClick={() => setFilter('all')} />
        <Chip label="Masuk" active={filter === 'income'} variant="outline" onClick={() => setFilter('income')} />
        <Chip label="Keluar" active={filter === 'expense'} variant="outline" onClick={() => setFilter('expense')} />
        <span className="text-body-sm" style={{ marginLeft: 'auto', color: 'var(--color-on-surface-variant)' }}>
          {filtered.length} item
        </span>
      </div>

      {/* Total */}
      {filtered.length > 0 && (
        <div className="text-body-sm" style={{
          color: totalFiltered >= 0 ? 'var(--color-primary)' : '#ffb2b7',
          textAlign: 'right', fontWeight: 600,
        }}>
          Net: {totalFiltered >= 0 ? '+' : '-'}{fmt(Math.abs(totalFiltered))}
        </div>
      )}

      {/* Groups */}
      {Object.keys(grouped).length === 0 && (
        <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
          {search ? 'Tidak ada transaksi yang cocok' : 'Belum ada transaksi'}
        </div>
      )}

      {Object.entries(grouped).map(([dateLabel, txs]) => (
        <div key={dateLabel}>
          <h4 className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-sm)' }}>
            {dateLabel}
          </h4>
          <Card padding="none" style={{ padding: '0 var(--spacing-md)' }}>
            {txs.map((tx, idx) => {
              const isIncome = tx.type === 'income';
              const timeStr = new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
              return (
                <ListItem
                  key={tx.id}
                  icon={renderCategoryIcon(tx.category, 20, customCategories)}
                  iconColor={isIncome ? 'var(--color-primary)' : '#ffb2b7'}
                  iconBgColor={isIncome ? 'rgba(78, 222, 163, 0.1)' : 'rgba(255, 178, 183, 0.1)'}
                  title={tx.description}
                  subtitle={`${tx.category} · ${timeStr}`}
                  trailingText={`${isIncome ? '+' : '-'} ${fmt(tx.amount)}`}
                  trailingTextColor={isIncome ? 'var(--color-primary)' : '#ffb2b7'}
                  trailingIcon={
                    <div onClick={(e) => { e.stopPropagation(); setDeleteId(tx.id); }} style={{ cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </div>
                  }
                  style={idx === txs.length - 1 ? { borderBottom: 'none' } : undefined}
                />
              );
            })}
          </Card>
        </div>
      ))}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Transaksi"
        message="Apakah Anda yakin ingin menghapus transaksi ini?"
        onConfirm={() => { if (deleteId) onDeleteTransaction(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
