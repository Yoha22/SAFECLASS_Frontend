import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';
import { getRoleFromEmail, ROLE_LABELS } from '@/constants/roles';

const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 30;

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked,   setLocked]   = useState(false);
  const [countdown, setCountdown] = useState(0);

  const detectedRole = useMemo(() => getRoleFromEmail(email), [email]);

  // Countdown timer while locked
  const startLockTimer = () => {
    setLocked(true);
    setCountdown(LOCK_SECONDS);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); setLocked(false); setAttempts(0); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked || loading) return;
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        startLockTimer();
        setError('Cuenta bloqueada temporalmente por múltiples intentos fallidos.');
      } else {
        const rem = MAX_ATTEMPTS - next;
        setError(`Credenciales inválidas. ${rem} intento${rem !== 1 ? 's' : ''} restante${rem !== 1 ? 's' : ''}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden">
      {/* Hex grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" aria-hidden="true">
        <defs>
          <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon points="30,2 58,18 58,34 30,50 2,34 2,18" fill="none" stroke="#3b82f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="0 52" dur="30s" repeatCount="indefinite"/>
        </rect>
      </svg>

      {/* Card */}
      <div className="relative z-10 w-[420px] bg-surface-card border border-[#1e2d4a] rounded-xl px-10 py-9 shadow-2xl animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-9">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#1e2d4a] border border-[#253d6b] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="12" r="2" fill="#3b82f6" stroke="none"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-widest">SAFECLASS</h1>
          <p className="text-xs text-text-hint mt-1.5 tracking-wider">SISTEMA DE VIGILANCIA ESCOLAR</p>
        </div>

        {/* Role indicator */}
        {detectedRole && (
          <div className="mb-5 px-3 py-2 rounded-md bg-blue-500/5 border border-blue-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ROLE_LABELS[detectedRole]?.color }} />
            <span className="text-xs text-text-secondary">
              Rol detectado: <strong style={{ color: ROLE_LABELS[detectedRole]?.color }}>{ROLE_LABELS[detectedRole]?.label}</strong>
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <Icon name="alert" size={14} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Lock countdown */}
        {locked && (
          <div className="mb-4 px-3 py-2.5 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm flex items-center gap-2">
            <Icon name="lock" size={14} className="shrink-0" />
            Reintento disponible en <strong className="font-mono ml-1">{countdown}s</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="block text-[11px] text-text-hint tracking-wider mb-1.5">CORREO INSTITUCIONAL</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none">
                <Icon name="mail" size={15} />
              </span>
              <input
                type="email" required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="usuario@iecol.edu.co"
                disabled={locked}
                className="w-full pl-9 pr-3 py-2.5 bg-surface border border-[#1e2d4a] rounded-md text-text-primary text-sm placeholder:text-text-hint focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] text-text-hint tracking-wider mb-1.5">CONTRASEÑA</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none">
                <Icon name="lock" size={15} />
              </span>
              <input
                type="password" required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                disabled={locked}
                className="w-full pl-9 pr-3 py-2.5 bg-surface border border-[#1e2d4a] rounded-md text-text-primary text-sm placeholder:text-text-hint focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          {/* Attempt indicators */}
          {attempts > 0 && !locked && (
            <div className="flex items-center gap-1">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div key={i} className="w-5 h-1 rounded-full transition-colors" style={{ background: i < attempts ? '#ef4444' : '#1e2d4a' }} />
              ))}
              <span className="text-[11px] text-text-hint ml-1">{MAX_ATTEMPTS - attempts} intento{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} restante{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="text-right -mt-2">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              Olvidé mi contraseña
            </button>
          </div>

          <button
            type="submit"
            disabled={locked || loading}
            className="w-full py-3 rounded-md text-sm font-semibold tracking-wider text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                Verificando...
              </>
            ) : locked ? 'Cuenta bloqueada' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Demo hint */}
        <div className="mt-6 px-3 py-2.5 bg-white/[0.03] border border-[#1e2d4a] rounded-md text-center text-[11px] text-text-hint">
          Demo: <span className="font-mono text-text-secondary">maria.torres@iecol.edu.co</span> / <span className="font-mono text-text-secondary">safeclass</span>
        </div>

        <p className="mt-5 text-center text-[11px] text-[#334155]">SAFECLASS v2.4.1 — IECol Sistema Educativo Rural</p>
      </div>
    </div>
  );
}
