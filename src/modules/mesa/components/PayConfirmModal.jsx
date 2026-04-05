import { ClipboardList, AlertCircle, Loader, X } from 'lucide-react';
import { C, FONT, glow } from '../../../styles/designTokens';

/**
 * Modal de confirmación para "Pedir Cuenta".
 * Maneja los estados: idle, loading, error.
 *
 * Props:
 *   isOpen   - boolean
 *   onConfirm - () => void   (disparar el hook)
 *   onCancel  - () => void
 *   loading  - boolean
 *   error    - string
 */
export function PayConfirmModal({ isOpen, onConfirm, onCancel, loading, error }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={!loading ? onCancel : undefined}
        style={{
          position: 'fixed', inset: 0, zIndex: 9990,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
          animation: 'pcmFadeIn 0.18s ease',
          fontFamily: FONT,
        }}
      >
        {/* Card */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: C.bgCard,
            border: `1.5px solid ${C.border}`,
            borderRadius: '22px',
            padding: '28px 28px 24px',
            maxWidth: '400px', width: '100%',
            boxShadow: '0 28px 72px rgba(0,0,0,0.55)',
            animation: 'pcmScaleIn 0.2s ease',
            position: 'relative',
          }}
        >
          {/* Close × */}
          {!loading && (
            <button
              onClick={onCancel}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'transparent', border: 'none',
                cursor: 'pointer', color: C.textMuted, padding: '4px',
                display: 'flex', borderRadius: '6px', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C.pink; e.currentTarget.style.background = `${C.pink}12`; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = 'transparent'; }}
            >
              <X size={16} />
            </button>
          )}

          {/* Icon */}
          <div style={{
            width: '58px', height: '58px', borderRadius: '16px',
            background: `${C.orange}12`, border: `1.5px solid ${C.orange}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '18px', boxShadow: glow(C.orange, '22'),
          }}>
            <ClipboardList size={28} color={C.orange} />
          </div>

          {/* Title & description */}
          <h2 style={{ margin: '0 0 8px', color: C.textPrimary, fontSize: '22px', fontWeight: '800', lineHeight: 1.2 }}>
            ¿Pedir la cuenta?
          </h2>
          <p style={{ margin: '0 0 20px', color: C.textSecondary, fontSize: '14px', lineHeight: 1.65 }}>
            Notificaremos al cajero que estás listo para pagar. Asegúrate de que no te falte nada.
          </p>

          {/* Error message */}
          {error && (
            <div style={{
              background: `${C.pink}10`, border: `1px solid ${C.pink}40`,
              borderRadius: '10px', padding: '11px 14px', marginBottom: '18px',
              display: 'flex', alignItems: 'flex-start', gap: '9px',
              color: C.pink, fontSize: '13px', fontWeight: '600',
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: C.border, margin: '0 0 18px' }} />

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1, background: 'transparent',
                border: `1.5px solid ${C.border}`,
                borderRadius: '10px', padding: '12px 16px',
                color: C.textSecondary, fontFamily: FONT, fontWeight: '700', fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = C.textMuted; e.currentTarget.style.color = C.textPrimary; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                background: loading ? C.bgAccent : C.orange,
                border: `1.5px solid ${loading ? C.border : C.orange}`,
                borderRadius: '10px', padding: '12px 16px',
                color: loading ? C.textMuted : '#fff',
                fontFamily: FONT, fontWeight: '800', fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                boxShadow: loading ? 'none' : glow(C.orange, '44'),
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {loading
                ? <><Loader size={15} style={{ animation: 'pcmSpin 0.8s linear infinite' }} /> Verificando...</>
                : <><ClipboardList size={15} /> Confirmar</>
              }
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pcmFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pcmScaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pcmSpin    { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
