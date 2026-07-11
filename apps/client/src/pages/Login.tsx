import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Mountain, User, UserPlus, BarChart2, Shield, Smartphone, Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginUser, registerUser } from '../store';
import type { User as UserType } from '../types';

interface LoginProps {
  onAuth: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.ok) { onAuth(result.user); } else { setError(result.error); }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Nama wajib diisi'); return; }
    if (password !== confirmPassword) { setError('Password tidak cocok'); return; }
    setLoading(true);
    try {
      const result = await registerUser(name, email, password);
      if (result.ok) { onAuth(result.user); } else { setError(result.error); }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setConfirmPassword('');
  };

  const features = [
    { icon: BarChart2, title: 'Laporan Real-time', desc: 'Pantau arus kas harian, mingguan, dan bulanan' },
    { icon: Shield, title: 'Data Aman', desc: 'Tersimpan di perangkat dengan enkripsi lokal' },
    { icon: Smartphone, title: 'Mobile & Desktop', desc: 'Akses dari mana saja, kapan saja' },
  ];

  return (
    <div className="login-shell">
      {/* Desktop Left Hero Panel — hidden on mobile via CSS */}
      <div className="login-hero">
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px',
          borderRadius: '50%', border: '1px solid var(--color-primary-alpha)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30%', right: '-20%', width: '600px', height: '600px',
          borderRadius: '50%', border: '1px solid var(--color-primary-alpha)',
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '10%', width: '200px', height: '200px',
          background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px', textAlign: 'center' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '28px',
            background: 'linear-gradient(135deg, var(--color-primary-container), var(--color-primary-alpha))',
            border: '1px solid var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--spacing-xl)',
            animation: 'pulseGlow 3s ease-in-out infinite',
          }}>
            <Mountain size={48} color="var(--color-primary)" strokeWidth={1.5} />
          </div>

          <h2 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: 'var(--spacing-sm)', letterSpacing: '-0.02em' }}>
            Kas Gunungsari
          </h2>
          <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-xl)', lineHeight: '28px' }}>
            Sistem pencatatan keuangan modern untuk Desa Wisata Gunungsari
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', textAlign: 'left' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  backgroundColor: 'var(--color-primary-alpha)',
                  border: '1px solid var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <f.icon size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <div className="text-body-lg" style={{ fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: '2px' }}>
                    {f.title}
                  </div>
                  <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel (right on desktop, centered on mobile) */}
      <div className="login-form-panel">
        {/* Logo (visible on mobile, small on desktop) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <div className="login-mobile-logo" style={{
            width: '80px', height: '80px', borderRadius: 'var(--rounded-full)',
            backgroundColor: 'var(--color-surface-container-highest)',
            border: '1px solid var(--color-outline-variant)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <Mountain size={40} color="var(--color-on-surface)" strokeWidth={1.5} />
          </div>

          <h1 className="text-headline-lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)' }}>
            {mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
          </h1>
          <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center' }}>
            {mode === 'login' ? 'Masuk ke akun Anda' : 'Daftar untuk mulai mencatat'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{
          width: '100%', maxWidth: '400px', padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {mode === 'register' && (
              <Input label="Nama" type="text" placeholder="Nama lengkap" value={name}
                onChange={e => setName(e.target.value)} icon={<User size={20} />} required />
            )}
            <Input label="Email" type="email" placeholder="nama@desawisata.id" value={email}
              onChange={e => setEmail(e.target.value)} icon={<Mail size={20} />} required />
            <Input label="Password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} icon={<Lock size={20} />}
              rightAction={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {showPassword ? <EyeOff size={18} color="var(--color-outline)" /> : <Eye size={18} color="var(--color-outline)" />}
                  </span>
                  {mode === 'login' && (
                    <span className="text-label-caps" style={{ color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => {
                      if (!email) { setError('Masukkan email terlebih dahulu'); return; }
                      setLoading(true);
                      import('../store').then(({ requestPasswordReset }) => {
                        requestPasswordReset(email).then((res) => {
                          if (res.ok) setError('Email reset password telah dikirim! Cek inbox Anda.');
                          else setError(res.error);
                          setLoading(false);
                        });
                      });
                    }}>Lupa?</span>
                  )}
                </div>
              }
              required />
            {mode === 'register' && (
              <Input label="Konfirmasi Password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} icon={<Lock size={20} />} required />
            )}

            {error && (
              <div style={{
                padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-secondary-alpha)',
                border: '1px solid var(--color-secondary)', borderRadius: 'var(--rounded)',
                color: 'var(--color-secondary)', textAlign: 'center',
              }} className="text-body-sm">{error}</div>
            )}

            <Button type="submit" style={{ marginTop: 'var(--spacing-xs)' }} disabled={loading}>
              {loading ? <span style={{ opacity: 0.7 }}>Memproses...</span>
                : mode === 'login' ? <>MASUK <ArrowRight size={20} /></>
                  : <>DAFTAR <UserPlus size={20} /></>}
            </Button>
          </form>
        </div>

        {/* Toggle */}
        <div className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center' }}>
          {mode === 'login' ? (
            <span>Belum punya akun? <span onClick={toggleMode} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>Daftar sekarang</span></span>
          ) : (
            <span>Sudah punya akun? <span onClick={toggleMode} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>Masuk</span></span>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'var(--spacing-xl)', color: 'var(--color-outline)' }} className="text-body-sm">
          © 2026 Desa Wisata Gunungsari
        </div>
      </div>
    </div>
  );
};

export default Login;
