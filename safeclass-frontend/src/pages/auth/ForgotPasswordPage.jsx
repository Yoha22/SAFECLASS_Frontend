import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden">
      {/* Hex grid background — mismo patrón que LoginPage */}
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

      <div className="relative z-10 w-[420px] bg-surface-card border border-[#1e2d4a] rounded-xl px-10 py-9 shadow-2xl animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#1e2d4a] border border-[#253d6b] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="12" r="2" fill="#3b82f6" stroke="none"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-widest">SAFECLASS</h1>
          <p className="text-xs text-text-hint mt-1.5 tracking-wider">SISTEMA DE VIGILANCIA ESCOLAR</p>
        </div>

        {sent ? (
          /* ── Estado: correo enviado ── */
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <Icon name="check" size={26} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary mb-1">Correo enviado</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Si <span className="font-mono text-blue-400">{email}</span> corresponde a una cuenta activa,
                recibirás un enlace para restablecer tu contraseña en los próximos minutos.
              </p>
            </div>
            <p className="text-xs text-text-hint">
              Revisa también tu carpeta de spam. El enlace expira en <strong className="text-text-secondary">30 minutos</strong>.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-2 w-full py-2.5 rounded-md text-sm font-semibold tracking-wider text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          /* ── Estado: formulario ── */
          <>
            <div className="mb-6">
              <h2 className="text-base font-semibold text-text-primary mb-1">Recuperar contraseña</h2>
              <p className="text-xs text-text-hint leading-relaxed">
                Ingresa tu correo institucional y te enviaremos un enlace para crear una nueva contraseña.
              </p>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <Icon name="alert" size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-surface border border-[#1e2d4a] rounded-md text-text-primary text-sm placeholder:text-text-hint focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-md text-sm font-semibold tracking-wider text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                    Enviando...
                  </>
                ) : 'Enviar enlace de recuperación'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs text-text-hint hover:text-text-secondary transition-colors flex items-center gap-1.5 mx-auto"
              >
                <Icon name="arrowLeft" size={12} />
                Volver al inicio de sesión
              </button>
            </div>
          </>
        )}

        <p className="mt-7 text-center text-[11px] text-[#334155]">SAFECLASS v2.4.1 — IECol Sistema Educativo Rural</p>
      </div>
    </div>
  );
}
