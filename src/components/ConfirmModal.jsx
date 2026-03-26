import { C, FONT, glow } from '../styles/designTokens';
import { AlertTriangle } from 'lucide-react';
import Button from './UI/Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)", zIndex: 500,
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", zIndex: 501,
        width: "90%", maxWidth: "380px",
        background: C.bgCard, border: `1.5px solid ${C.borderBright}`,
        borderRadius: "20px", padding: "24px", textAlign: "center",
        boxShadow: `0 24px 64px rgba(0,0,0,0.55), ${glow(C.pink, "18")}`,
        fontFamily: FONT,
      }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "14px",
          background: `${C.pink}18`, border: `1.5px solid ${C.pink}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <AlertTriangle size={24} color={C.pink} />
        </div>
        
        <h3 style={{ margin: "0 0 8px", color: C.textPrimary, fontSize: "18px", fontWeight: "800" }}>
          {title}
        </h3>
        <p style={{ margin: "0 0 24px", color: C.textSecondary, fontSize: "14px", lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} fullWidth>
            Confirmar
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
