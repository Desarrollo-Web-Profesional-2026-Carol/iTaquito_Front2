import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../../../services/auth';
import { C, FONT, ROLE_COLORS, glow } from '../../../styles/designTokens';
import {
  Mail, Lock, LogIn, AlertCircle, Eye, EyeOff,
  Utensils, ShieldCheck, KeyRound, HelpCircle,
  ArrowLeft, CheckCircle, RefreshCw,
} from 'lucide-react';

/* ─── PAPEL PICADO ───────────────────────────────────────────── */
const PICADO = [C.pink, C.orange, C.yellow, C.teal, C.purple, C.pinkDim, C.orangeDim, C.tealDim];
function PapelPicado() {
  return (
    <div style={{ width: '100%', lineHeight: 0 }}>
      <div style={{ display: 'flex', width: '100%' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 0,
            borderLeft: '50px solid transparent',
            borderRight: '50px solid transparent',
            borderTop: `32px solid ${PICADO[i % PICADO.length]}`,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─── DEMO ROLES ─────────────────────────────────────────────── */
const DEMO_ROLES = [
  { label: 'Admin',  email: 'admin@itaquito.com',  password: 'admin123',  color: ROLE_COLORS.admin  },
  { label: 'Mesero', email: 'mesero@itaquito.com', password: 'mesero123', color: ROLE_COLORS.mesero },
  { label: 'Caja',   email: 'caja@itaquito.com',   password: 'caja123',   color: ROLE_COLORS.caja   },
  { label: 'Mesa',   email: 'mesa@itaquito.com',   password: 'mesa123',   color: ROLE_COLORS.mesa   },
];

/* ─── INPUT FLOTANTE ─────────────────────────────────────────── */
function InputField({ id, type, label, value, onChange, Icon, extra, accentColor }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const accent = accentColor || C.pink;

  return (
    <div style={{ position: 'relative', marginBottom: '16px' }}>
      <div style={{
        position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
        color: focused ? accent : C.textMuted, transition: 'color 0.2s', zIndex: 1,
      }}>
        <Icon size={16} />
      </div>
      <input
        id={id} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder=" " required
        style={{
          width: '100%', background: C.bg,
          border: `1.5px solid ${focused ? accent : C.border}`,
          borderRadius: '10px', padding: '18px 44px 8px 42px',
          color: C.textPrimary, fontFamily: FONT, fontSize: '14px', fontWeight: '500',
          outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: focused ? glow(accent, '22') : 'none', boxSizing: 'border-box',
        }}
      />
      <label htmlFor={id} style={{
        position: 'absolute', left: '42px',
        top: focused || filled ? '8px' : '50%',
        transform: focused || filled ? 'translateY(0)' : 'translateY(-50%)',
        fontSize: focused || filled ? '10px' : '14px',
        color: focused ? accent : C.textMuted, fontFamily: FONT, fontWeight: '600',
        letterSpacing: focused || filled ? '0.8px' : '0',
        textTransform: focused || filled ? 'uppercase' : 'none',
        transition: 'all 0.2s ease', pointerEvents: 'none',
      }}>
        {label}
      </label>
      {extra && (
        <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
          {extra}
        </div>
      )}
    </div>
  );
}

/* ─── PASO 1: FORMULARIO LOGIN ───────────────────────────────── */
function StepLogin({ on2FARequired, onForgotPassword }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result?.requiresTwoFactor) {
        on2FARequired(result.userId, email, password);
      }
      
    } catch (err) {
      const msg = err.response?.data?.message || 'Correo o contraseña incorrectos';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (e, p) => { 
    setEmail(e); 
    setPassword(p); 
    setError(''); 
  };

  return (
    <>
      {error && (
        <div style={{
          background: `${C.pink}12`, border: `1px solid ${C.pink}44`,
          borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '8px',
          color: C.pink, fontSize: '13px', fontWeight: '600',
        }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField id="email" type="email" label="Correo electrónico"
          value={email} onChange={e => setEmail(e.target.value)} Icon={Mail} />
        <InputField id="password" type={showPass ? 'text' : 'password'} label="Contraseña"
          value={password} onChange={e => setPassword(e.target.value)} Icon={Lock}
          extra={
            <button type="button" onClick={() => setShowPass(s => !s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 0, display: 'flex' }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />

        <button type="submit" disabled={loading} style={{
          width: '100%', background: loading ? C.bgAccent : C.pink, color: loading ? C.textMuted : '#fff',
          border: 'none', borderRadius: '10px', padding: '13px', fontFamily: FONT,
          fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          marginTop: '8px', transition: 'all 0.2s',
          boxShadow: loading ? 'none' : glow(C.pink), letterSpacing: '0.3px',
        }}>
          {loading
            ? <><RefreshCw size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Ingresando...</>
            : <><LogIn size={16} /> Ingresar</>
          }
        </button>
      </form>

      {/* ¿Olvidaste tu contraseña? */}
      <button onClick={onForgotPassword} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: C.textMuted, fontFamily: FONT, fontSize: '12px', fontWeight: '600',
        display: 'flex', alignItems: 'center', gap: '5px', margin: '12px auto 0',
        padding: '4px 8px', borderRadius: '6px', transition: 'color 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = C.pink}
        onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
      >
        <HelpCircle size={13} /> ¿Olvidaste tu contraseña?
      </button>

      {/* Demo roles */}
      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ color: C.textMuted, fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '10px' }}>
          Acceso rápido — Demo
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {DEMO_ROLES.map(({ label, email: e, password: p, color }) => (
            <button key={label} onClick={() => fillCredentials(e, p)} style={{
              background: `${color}12`, border: `1px solid ${color}44`, borderRadius: '8px',
              padding: '8px 10px', color, fontFamily: FONT, fontWeight: '700',
              fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={ev => ev.currentTarget.style.background = `${color}22`}
              onMouseLeave={ev => ev.currentTarget.style.background = `${color}12`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── PASO 2: CÓDIGO 2FA ─────────────────────────────────────── */
function Step2FA({ userId, email, password, onBack }) {
  const [code, setCode]           = useState('');
  const [useBackup, setUseBackup] = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const { verify2FA, verify2FAWithBackup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    
    try {
      if (useBackup) {
        await verify2FAWithBackup(email, password, code);
      } else {
        await verify2FA(userId, code);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Código inválido. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    
    if (val.length === 6 && !loading) {
      setTimeout(() => {
        const form = e.target.closest('form');
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 100);
    }
  };

  const handleBackupChange = (e) => {
    const val = e.target.value.toUpperCase().slice(0, 8);
    setCode(val);
    
    if (val.length === 8 && !loading) {
      setTimeout(() => {
        const form = e.target.closest('form');
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 100);
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: `${C.purple}22`, border: `1.5px solid ${C.purple}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', boxShadow: glow(C.purple, '33'),
        }}>
          <ShieldCheck size={24} color={C.purple} />
        </div>
        <h3 style={{ margin: '0 0 6px', color: C.textPrimary, fontWeight: '800', fontSize: '17px' }}>
          Verificación en dos pasos
        </h3>
        <p style={{ margin: 0, color: C.textMuted, fontSize: '13px', lineHeight: 1.5 }}>
          {useBackup
            ? 'Ingresa uno de tus códigos de respaldo'
            : 'Ingresa el código de 6 dígitos de tu app autenticadora'
          }
        </p>
      </div>

      {error && (
        <div style={{
          background: `${C.pink}12`, border: `1px solid ${C.pink}44`,
          borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '8px',
          color: C.pink, fontSize: '13px', fontWeight: '600',
        }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!useBackup ? (
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text" 
              inputMode="numeric" 
              pattern="[0-9]*"
              value={code} 
              onChange={handleCodeChange}
              placeholder="000000" 
              maxLength={6} 
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                background: C.bg, border: `2px solid ${code.length === 6 ? C.purple : C.border}`,
                borderRadius: '12px', padding: '16px',
                color: C.textPrimary, fontFamily: 'monospace',
                fontSize: '28px', fontWeight: '800', letterSpacing: '12px',
                textAlign: 'center', outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: code.length === 6 ? glow(C.purple, '33') : 'none',
              }}
              onFocus={e => e.target.style.borderColor = C.purple}
              onBlur={e => e.target.style.borderColor = code.length === 6 ? C.purple : C.border}
            />
          </div>
        ) : (
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <KeyRound size={15} color={C.textMuted} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
            }} />
            <input
              type="text" 
              value={code} 
              onChange={handleBackupChange}
              placeholder="XXXXXXXX" 
              maxLength={8} 
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                background: C.bg, border: `1.5px solid ${C.border}`,
                borderRadius: '10px', padding: '12px 12px 12px 36px',
                color: C.textPrimary, fontFamily: 'monospace',
                fontSize: '16px', fontWeight: '700', letterSpacing: '4px',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = C.purple}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
        )}

        <button type="submit" disabled={loading || code.length < (useBackup ? 6 : 6)} style={{
          width: '100%', background: loading ? C.bgAccent : C.purple,
          color: loading ? C.textMuted : '#fff', border: 'none',
          borderRadius: '10px', padding: '13px', fontFamily: FONT,
          fontWeight: '800', fontSize: '14px',
          cursor: (loading || code.length < 6) ? 'not-allowed' : 'pointer',
          opacity: code.length < 6 ? 0.6 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'all 0.2s', boxShadow: loading ? 'none' : glow(C.purple, '44'),
        }}>
          {loading
            ? <><RefreshCw size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Verificando...</>
            : <><ShieldCheck size={15} /> Verificar</>
          }
        </button>
      </form>

      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <button onClick={() => { setUseBackup(u => !u); setCode(''); setError(''); }} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.teal, fontFamily: FONT, fontSize: '12px', fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '5px',
        }}>
          <KeyRound size={12} />
          {useBackup ? 'Usar código de autenticadora' : 'Usar código de respaldo'}
        </button>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.textMuted, fontFamily: FONT, fontSize: '12px', fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '5px',
        }}>
          <ArrowLeft size={12} /> Volver al login
        </button>
      </div>
    </>
  );
}

/* ─── PASO 3: RECUPERACIÓN DE CONTRASEÑA (ENVÍA CORREO) ───────── */
function StepPasswordReset({ onBack }) {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    try {
      await authService.requestPasswordReset(email); // ✅ usa authService
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '14px',
        background: `${C.teal}22`, border: `1.5px solid ${C.teal}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', boxShadow: glow(C.teal, '33'),
      }}>
        <CheckCircle size={24} color={C.teal} />
      </div>
      <h3 style={{ margin: '0 0 8px', color: C.textPrimary, fontWeight: '800', fontSize: '16px' }}>
        ¡Revisa tu correo!
      </h3>
      <p style={{ margin: '0 0 8px', color: C.textMuted, fontSize: '13px', lineHeight: 1.6 }}>
        Te hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong>.
      </p>
      <p style={{ margin: '0 0 20px', color: C.textMuted, fontSize: '12px', lineHeight: 1.5 }}>
        El enlace expirará en 1 hora.
      </p>
      <button onClick={onBack} style={{
        background: C.pink, color: '#fff', border: 'none', borderRadius: '10px',
        padding: '11px 24px', fontFamily: FONT, fontWeight: '700', fontSize: '13px',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: glow(C.pink, '44'),
      }}>
        <ArrowLeft size={14} /> Volver al login
      </button>
    </div>
  );

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: `${C.orange}22`, border: `1.5px solid ${C.orange}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', boxShadow: glow(C.orange, '33'),
        }}>
          <KeyRound size={24} color={C.orange} />
        </div>
        <h3 style={{ margin: '0 0 6px', color: C.textPrimary, fontWeight: '800', fontSize: '16px' }}>
          Recuperar contraseña
        </h3>
        <p style={{ margin: 0, color: C.textMuted, fontSize: '13px', lineHeight: 1.5 }}>
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      {error && (
        <div style={{
          background: `${C.pink}12`, border: `1px solid ${C.pink}44`,
          borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '8px',
          color: C.pink, fontSize: '13px', fontWeight: '600',
        }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField id="reset-email" type="email" label="Tu correo electrónico"
          value={email} onChange={e => setEmail(e.target.value)}
          Icon={Mail} accentColor={C.orange}
        />
        <button type="submit" disabled={loading || !email} style={{
          width: '100%', background: loading ? C.bgAccent : C.orange,
          color: loading ? C.textMuted : '#fff', border: 'none',
          borderRadius: '10px', padding: '13px', fontFamily: FONT,
          fontWeight: '800', fontSize: '14px',
          cursor: (loading || !email) ? 'not-allowed' : 'pointer',
          opacity: !email ? 0.6 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'all 0.2s', boxShadow: loading ? 'none' : glow(C.orange, '44'),
        }}>
          {loading
            ? <><RefreshCw size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Enviando...</>
            : 'Enviar enlace de recuperación'
          }
        </button>
      </form>

      <button onClick={onBack} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: C.textMuted, fontFamily: FONT, fontSize: '12px', fontWeight: '600',
        display: 'flex', alignItems: 'center', gap: '5px', margin: '14px auto 0',
      }}>
        <ArrowLeft size={12} /> Volver al login
      </button>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN PRINCIPAL
═══════════════════════════════════════════════════════════════ */
const Login = () => {
  const [step, setStep] = useState('login'); // 'login' | '2fa' | 'reset'
  const [twoFAData, setTwoFAData] = useState({ userId: null, email: '', password: '' });

  const handle2FARequired = (userId, email, password) => {
    setTwoFAData({ userId, email, password });
    setStep('2fa');
  };

  const handleForgotPassword = () => {
    setStep('reset');
  };

  const handleBackToLogin = () => {
    setStep('login');
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, fontFamily: FONT,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbes de fondo */}
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: `${C.pink}08`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: `${C.teal}08`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '40%', left: '40%', width: '300px', height: '300px', borderRadius: '50%', background: `${C.orange}06`, filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        background: C.bgCard, border: `1.5px solid ${C.border}`,
        borderRadius: '24px', overflow: 'hidden',
        boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px ${C.borderBright}`,
      }}>
        <PapelPicado />

        {/* Header */}
        <div style={{ padding: '28px 32px 0', textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: `${C.pink}22`, border: `1.5px solid ${C.pink}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: glow(C.pink),
          }}>
            <Utensils size={26} color={C.pink} />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '800', color: C.pink, letterSpacing: '-0.5px' }}>
            iTaquito
          </h1>
          <p style={{ margin: '0 0 4px', color: C.textSecondary, fontSize: '13px', fontWeight: '500' }}>
            Sistema de gestión integral
          </p>
          <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '14px', marginBottom: '24px' }}>
            {[C.pink, C.orange, C.yellow, C.teal, C.purple].map((c, i) => (
              <div key={i} style={{ width: '28px', height: '3px', borderRadius: '2px', background: c }} />
            ))}
          </div>
        </div>

        {/* Contenido según step */}
        <div style={{ padding: '0 32px 32px' }}>
          {step === 'login' && (
            <StepLogin
              on2FARequired={handle2FARequired}
              onForgotPassword={handleForgotPassword}
            />
          )}
          {step === '2fa' && (
            <Step2FA
              userId={twoFAData.userId}
              email={twoFAData.email}
              password={twoFAData.password}
              onBack={handleBackToLogin}
            />
          )}
          {step === 'reset' && (
            <StepPasswordReset onBack={handleBackToLogin} />
          )}
        </div>

        <div style={{ transform: 'scaleY(-1)' }}>
          <PapelPicado />
        </div>
      </div>

      <p style={{ marginTop: '24px', color: C.textMuted, fontSize: '12px', textAlign: 'center' }}>
        © {new Date().getFullYear()} iTaquito · Hecho con ♥ en México
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;