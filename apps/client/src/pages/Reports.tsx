import React, { useState, useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { ListItem } from '../components/ListItem';
import { Button } from '../components/Button';
import type { Transaction, CustomCategory } from '../types';
import { renderCategoryIcon } from '../utils/icons';

type Period = 'week' | 'month' | 'year';

interface ReportsProps {
  transactions: Transaction[];
  customCategories: CustomCategory[];
}

export const Reports: React.FC<ReportsProps> = ({ transactions, customCategories }) => {
  const [period, setPeriod] = useState<Period>('month');
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const filtered = useMemo(() => {
    const now = new Date();
    const start = new Date();
    if (period === 'week') start.setDate(now.getDate() - 7);
    else if (period === 'month') start.setMonth(now.getMonth() - 1);
    else start.setFullYear(now.getFullYear() - 1);
    return transactions.filter(t => new Date(t.date) >= start);
  }, [transactions, period]);

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const categoryAgg = useMemo(() => {
    const agg: Record<string, { amount: number; type: 'income' | 'expense'; category: string }> = {};
    filtered.forEach(tx => {
      if (!agg[tx.category]) agg[tx.category] = { amount: 0, type: tx.type, category: tx.category };
      agg[tx.category].amount += tx.amount;
    });
    return Object.values(agg).sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [filtered]);

  const chartData = useMemo(() => {
    const now = new Date();
    let labels: string[] = [];
    let ranges: { start: Date; end: Date }[] = [];

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        labels.push(['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()]);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        ranges.push({ start, end: new Date(start.getTime() + 86400000) });
      }
    } else if (period === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      for (let i = 0; i < 4; i++) {
        const wStart = new Date(monthStart); wStart.setDate(wStart.getDate() + i * 7);
        const wEnd = new Date(wStart); wEnd.setDate(wEnd.getDate() + 7);
        labels.push(`M${i + 1}`);
        ranges.push({ start: wStart, end: wEnd });
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(d.toLocaleDateString('id-ID', { month: 'short' }));
        ranges.push({ start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 1) });
      }
    }

    return labels.map((label, i) => {
      const { start, end } = ranges[i];
      return {
        label,
        income: transactions.filter(t => t.type === 'income' && new Date(t.date) >= start && new Date(t.date) < end).reduce((s, t) => s + t.amount, 0),
        expense: transactions.filter(t => t.type === 'expense' && new Date(t.date) >= start && new Date(t.date) < end).reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions, period]);

  const maxBar = Math.max(...chartData.flatMap(d => [d.income, d.expense]), 1);

  const handleExport = () => {
    const periodLabel = period === 'week' ? 'Minggu Ini' : period === 'month' ? 'Bulan Ini' : 'Tahun Ini';
    const now = new Date();
    const exportDate = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const fmtCurrency = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
    const fmtDate = (d: string) => new Date(d).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    const fmtTime = (d: string) => new Date(d).toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit'
    });

    const sortedFiltered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const totalIncome = sortedFiltered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = sortedFiltered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    // SEP directive + BOM — memberitahu Excel semua locale untuk pakai titik koma sebagai pemisah
    const BOM = '\uFEFF';
    const SEP = 'sep=;\n';
    const D = ';'; // delimiter titik koma

    const escCell = (val: string) => `"${val.replace(/"/g, '""')}"`;

    const lines: string[] = [];

    // ── Metadata header ─────────────────────────────────────────────
    lines.push(`LAPORAN KEUANGAN - KAS GUNUNGSARI${D}${D}${D}${D}${D}${D}${D}`);
    lines.push(`Periode${D}${periodLabel}${D}${D}${D}${D}${D}${D}`);
    lines.push(`Tanggal Ekspor${D}${exportDate}${D}${D}${D}${D}${D}${D}`);
    lines.push(`Jumlah Transaksi${D}${sortedFiltered.length} transaksi${D}${D}${D}${D}${D}${D}`);
    lines.push(`${D}${D}${D}${D}${D}${D}${D}`); // baris kosong

    // ── Header kolom ─────────────────────────────────────────────────
    lines.push([
      'No.', 'Tanggal', 'Waktu', 'Jenis Transaksi', 'Kategori', 'Keterangan', 'Jumlah (Rp)', 'Nominal'
    ].join(D));

    // ── Baris transaksi ──────────────────────────────────────────────
    sortedFiltered.forEach((t, idx) => {
      const jenis = t.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
      const sign = t.type === 'income' ? t.amount : -t.amount;
      const row = [
        String(idx + 1),
        fmtDate(t.date),
        fmtTime(t.date),
        jenis,
        t.category,
        escCell(t.description),
        fmtCurrency(t.amount),
        String(sign),          // kolom angka murni agar Excel bisa hitung SUM
      ].join(D);
      lines.push(row);
    });

    // ── Ringkasan ────────────────────────────────────────────────────
    lines.push(`${D}${D}${D}${D}${D}${D}${D}`); // baris kosong
    lines.push(`Total Pemasukan${D}${D}${D}${D}${D}${D}${fmtCurrency(totalIncome)}${D}${totalIncome}`);
    lines.push(`Total Pengeluaran${D}${D}${D}${D}${D}${D}${fmtCurrency(totalExpense)}${D}${-totalExpense}`);
    lines.push(`Laba / Rugi Bersih${D}${D}${D}${D}${D}${D}${netBalance >= 0 ? '+' : ''}${fmtCurrency(netBalance)}${D}${netBalance}`);

    const csvContent = BOM + SEP + lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const periodSlug = period === 'week' ? 'mingguan' : period === 'month' ? 'bulanan' : 'tahunan';
    a.download = `laporan_keuangan_${periodSlug}_${now.toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="desktop-grid">
      <h2 className="text-headline-lg desktop-full" style={{ color: 'var(--color-on-surface)' }}>Laporan Keuangan</h2>

      <div className="desktop-full" style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
        <Chip label="Minggu ini" active={period === 'week'} variant="outline" onClick={() => setPeriod('week')} />
        <Chip label="Bulan ini" active={period === 'month'} variant="outline" onClick={() => setPeriod('month')} />
        <Chip label="Tahun ini" active={period === 'year'} variant="outline" onClick={() => setPeriod('year')} />
      </div>

      <div className="desktop-full" style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
        <Card style={{ flex: 1, padding: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
            <ArrowDownRight size={16} color="var(--color-primary)" />
            <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>PEMASUKAN</span>
          </div>
          <div className="text-headline-md" style={{ color: 'var(--color-primary)' }}>{fmt(totalIncome)}</div>
        </Card>
        <Card style={{ flex: 1, padding: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
            <ArrowUpRight size={16} color="var(--color-secondary)" />
            <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>PENGELUARAN</span>
          </div>
          <div className="text-headline-md" style={{ color: 'var(--color-secondary)' }}>{fmt(totalExpense)}</div>
        </Card>
      </div>

      {/* Net balance for period */}
      <Card className="desktop-full" style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
        <div className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>LABA/RUGI BERSIH</div>
        <div className="text-headline-lg" style={{ color: totalIncome - totalExpense >= 0 ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
          {totalIncome - totalExpense >= 0 ? '+' : '-'}{fmt(Math.abs(totalIncome - totalExpense))}
        </div>
      </Card>

      {/* Bar Chart */}
      <Card className="desktop-full">
        <h3 className="text-headline-md" style={{ marginBottom: 'var(--spacing-lg)' }}>Arus Kas</h3>
        <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '100%' }}>
              <div style={{
                width: period === 'year' ? '8px' : '16px',
                height: `${Math.max((d.income / maxBar) * 100, 2)}%`,
                background: 'linear-gradient(to top, rgba(78,222,163,0.2), var(--color-primary))',
                borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease',
              }} />
              <div style={{
                width: period === 'year' ? '8px' : '16px',
                height: `${Math.max((d.expense / maxBar) * 100, 2)}%`,
                background: 'linear-gradient(to top, var(--color-secondary-alpha), var(--color-secondary))',
                borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }} className="text-label-caps">
          {chartData.map((d, i) => <span key={i} style={{ color: 'var(--color-on-surface-variant)', fontSize: period === 'year' ? '9px' : '12px' }}>{d.label}</span>)}
        </div>
        <div className="flex-center" style={{ gap: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--color-primary)' }} />
            <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Pemasukan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--color-secondary)' }} />
            <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Pengeluaran</span>
          </div>
        </div>
      </Card>

      {/* Top Categories */}
      <h3 className="text-headline-md desktop-full" style={{ marginTop: 'var(--spacing-xs)' }}>Kategori Terbesar</h3>
      {categoryAgg.length === 0 ? (
        <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: 'var(--spacing-lg) 0' }}>
          Tidak ada data untuk periode ini
        </div>
      ) : (
        <Card padding="none" style={{ padding: '0 var(--spacing-md)' }}>
          {categoryAgg.map((cat, idx) => {
            const isIncome = cat.type === 'income';
            return (
              <ListItem
                key={cat.category}
                icon={renderCategoryIcon(cat.category, 20, customCategories)}
                iconColor={isIncome ? 'var(--color-primary)' : 'var(--color-secondary)'}
                iconBgColor={isIncome ? 'var(--color-primary-alpha)' : 'var(--color-secondary-alpha)'}
                title={cat.category}
                subtitle={isIncome ? 'Pemasukan' : 'Pengeluaran'}
                trailingText={`${isIncome ? '+' : '-'} ${fmt(cat.amount)}`}
                trailingTextColor={isIncome ? 'var(--color-primary)' : 'var(--color-secondary)'}
                style={idx === categoryAgg.length - 1 ? { borderBottom: 'none' } : undefined}
              />
            );
          })}
        </Card>
      )}

      <div className="desktop-full">
        <Button variant="primary" style={{ marginTop: 'var(--spacing-sm)' }} onClick={handleExport}>
          <Download size={20} /> Unduh Laporan CSV
        </Button>
      </div>
    </div>
  );
};
