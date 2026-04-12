import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../../services/auth';
import { C, FONT, glow } from '../../../styles/designTokens';
import { Lock, CheckCircle, AlertCircle, RefreshCw, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const PAPEL_PICADO = [C.pink, C.orange, C.yellow, C.teal, C.purple, C.pinkDim, C.orangeDim, C.tealDim];
function PapelPicado() {
  return (
    <div style={{ width: '100%', lineHeight: 0 }}>
      <div style={{ display: 'flex', width: '100%' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 0,
            borderLeft: '50px solid transparent',
            borderRight: '50px solid transparent',
            borderTop: `32px solid ${PAPEL_PICADO[i % PAPEL_PICADO.length]}`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(null);

  // Verificar token al cargar
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setValidToken(false);
        setError('No se proporcionó token de recuperación');
        return;
      }

      try {
        const response = await authService.verifyResetToken(token);
        setValidToken(response.valid);
      } catch (err) {
        setValidToken(false);
        setError('El enlace ha expirado o es inválido');
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.resetPassword(token, newPassword);
      setMessage('Contraseña restablecida exitosamente');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras verifica token
  if (validToken === null) {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${C.border}`,
            borderTopColor: C.pink,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} />
          <p style={{ color: C.textSecondary, marginTop: '16px' }}>Verificando enlace...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Token inválido o expirado
  if (validToken === false) {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: FONT,
      }}>
        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>⏰</div>
          <h2 style={{ color: C.textPrimary, marginBottom: '8px' }}>Enlace expirado</h2>
          <p style={{ color: C.textSecondary, marginBottom: '24px' }}>
            El enlace de recuperación ha expirado o es inválido.
          </p>
          <Link to="/forgot-password" style={{
            display: 'inline-block',
            background: C.pink,
            color: '#fff',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '700',
          }}>
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  // Token válido - mostrar formulario
  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: FONT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: `${C.pink}08`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: `${C.teal}08`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: C.bgCard,
        border: `1.5px solid ${C.border}`,
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: `0 24px 64px rgba(0,0,0,0.5)`,
      }}>
        <PapelPicado />

        <div style={{ padding: '28px 32px 0', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: `${C.teal}22`,
            border: `1.5px solid ${C.teal}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: glow(C.teal),
          }}>
            <Lock size={26} color={C.teal} />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: '800', color: C.textPrimary }}>
            Nueva contraseña
          </h1>
          <p style={{ margin: '0 0 4px', color: C.textSecondary, fontSize: '13px' }}>
            Ingresa tu nueva contraseña
          </p>
          <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '14px', marginBottom: '24px' }}>
            {[C.pink, C.orange, C.yellow, C.teal, C.purple].map((c, i) => (
              <div key={i} style={{ width: '28px', height: '3px', borderRadius: '2px', background: c }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '0 32px 32px' }}>
          {message && (
            <div style={{
              background: `${C.teal}15`,
              border: `1px solid ${C.teal}`,
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: C.teal,
              fontSize: '13px',
              fontWeight: '600',
            }}>
              <CheckCircle size={15} /> {message}
            </div>
          )}

          {error && (
            <div style={{
              background: `${C.pink}12`,
              border: `1px solid ${C.pink}44`,
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: C.pink,
              fontSize: '13px',
              fontWeight: '600',
            }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: C.textMuted,
              }}>
                <Lock size={16} />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 42px',
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: '10px',
                  color: C.textPrimary,
                  fontFamily: FONT,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = C.teal}
                onBlur={(e) => e.target.style.borderColor = C.border}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: C.textMuted,
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: C.textMuted,
              }}>
                <Lock size={16} />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 42px',
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: '10px',
                  color: C.textPrimary,
                  fontFamily: FONT,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = C.teal}
                onBlur={(e) => e.target.style.borderColor = C.border}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? C.bgAccent : C.teal,
                color: loading ? C.textMuted : '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '13px',
                fontFamily: FONT,
                fontWeight: '800',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : glow(C.teal),
              }}
            >
              {loading
                ? <><RefreshCw size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Restableciendo...</>
                : 'Restablecer contraseña'
              }
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/login" style={{
              color: C.pink,
              textDecoration: 'none',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <ArrowLeft size={12} /> Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <div style={{ transform: 'scaleY(-1)' }}>
          <PapelPicado />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}