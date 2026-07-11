import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TransactionHistory } from './pages/TransactionHistory';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { BudgetPage } from './pages/Budget';
import Login from './pages/Login';
import { ManageCategoriesModal } from './components/ManageCategoriesModal';
import {
  getCurrentUser, logoutUser,
  getTransactions, addTransaction, deleteTransaction,
  getCustomCategories, addCustomCategory, deleteCustomCategory,
  getBudgets, addBudget, deleteBudget,
} from './store';
import type { User, Transaction, TransactionType, CustomCategory, Budget } from './types';
import { DEFAULT_CATEGORIES } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [activeTab, setActiveTab] = useState(() => {
    if (window.location.pathname === '/reset-password') return 'reset-password';
    return 'ledger';
  });
  const [initialized, setInitialized] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [darkTheme, setDarkTheme] = useState(() => {
    const saved = localStorage.getItem('kas_gunungsari_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('kas_gunungsari_theme', 'dark');
    } else {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('kas_gunungsari_theme', 'light');
    }
  }, [darkTheme]);

  const loadData = useCallback(async () => {
    try {
      const [txs, cats, bdgts] = await Promise.all([
        getTransactions(),
        getCustomCategories(),
        getBudgets(),
      ]);
      setTransactions(txs);
      setCustomCategories(cats);
      setBudgets(bdgts);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  }, []);

  // Init session
  useEffect(() => {
    const initSession = async () => {
      const existing = await getCurrentUser();
      if (existing) {
        setUser(existing);
        await loadData();
      }
      setInitialized(true);
    };
    initSession();
  }, [loadData]);

  const refresh = useCallback(async () => {
    if (user) {
      await loadData();
    }
  }, [user, loadData]);

  const handleAuth = async (loggedInUser: User) => {
    setUser(loggedInUser);
    await loadData();
    setActiveTab('ledger');
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setTransactions([]);
    setCustomCategories([]);
    setBudgets([]);
    setActiveTab('ledger');
  };

  const handleAddTransaction = async (data: { type: TransactionType; category: string; description: string; amount: number; date: string }) => {
    if (!user) return;
    try {
      await addTransaction(data);
      // Auto-save custom category if it's new
      const allExistingCats = [...DEFAULT_CATEGORIES[data.type], ...customCategories.filter(c => c.type === data.type).map(c => c.name)];
      if (!allExistingCats.includes(data.category)) {
        await addCustomCategory({ name: data.category, type: data.type, icon: 'MoreHorizontal' });
      }
      await refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTransaction = async (txId: string) => {
    if (!user) return;
    try {
      await deleteTransaction(txId);
      await refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCategory = async (cat: Omit<CustomCategory, 'id'>) => {
    if (!user) return;
    try {
      await addCustomCategory(cat);
      await refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!user) return;
    try {
      await deleteCustomCategory(catId);
      await refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddBudget = async (budget: Omit<Budget, 'id'>) => {
    if (!user) return;
    try {
      await addBudget(budget);
      await refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!user) return;
    try {
      await deleteBudget(budgetId);
      await refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!initialized) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--color-primary)' }}>Memuat Aplikasi...</div>;

  if (!user) {
    if (activeTab === 'reset-password') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px' }}>
          <h2>Reset Password</h2>
          <input type="password" id="new-pwd" placeholder="Password Baru" style={{ padding: '10px' }} />
          <button onClick={() => {
            const token = new URLSearchParams(window.location.search).get('token');
            const password = (document.getElementById('new-pwd') as HTMLInputElement).value;
            if (token && password) {
              import('./lib/auth-client').then(({ authClient }) => {
                authClient.resetPassword({ newPassword: password, token }).then(res => {
                  if (res.error) alert(res.error.message);
                  else {
                    alert('Password berhasil direset! Silakan login.');
                    window.location.href = '/';
                  }
                });
              });
            } else {
              alert('Token tidak valid atau password kosong');
            }
          }} style={{ padding: '10px 20px', cursor: 'pointer' }}>Reset</button>
        </div>
      );
    }
    return <Login onAuth={handleAuth} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'ledger':
        return (
          <Dashboard
            transactions={transactions}
            customCategories={customCategories}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onNavigate={setActiveTab}
          />
        );
      case 'transactions':
        return (
          <TransactionHistory
            transactions={transactions}
            customCategories={customCategories}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'reports':
        return <Reports transactions={transactions} customCategories={customCategories} />;
      case 'budget':
        return (
          <BudgetPage
            transactions={transactions}
            budgets={budgets}
            customCategories={customCategories}
            onAddBudget={handleAddBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        );
      case 'settings':
        return (
          <Settings
            user={user}
            onLogout={handleLogout}
            onUserUpdate={handleUserUpdate}
            onOpenCategories={() => setShowCategoriesModal(true)}
            darkTheme={darkTheme}
            setDarkTheme={setDarkTheme}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Layout
        activeTab={activeTab === 'transactions' ? 'ledger' : activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
        user={user}
      >
        {renderContent()}
      </Layout>

      <ManageCategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        customCategories={customCategories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </>
  );
}

export default App;
