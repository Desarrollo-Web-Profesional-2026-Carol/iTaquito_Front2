import { useState, useEffect } from 'react';
import { C, FONT, glow } from '../../../../styles/designTokens';
import { X, Save, UserPlus } from 'lucide-react';
import Button from '../../../UI/Button';

/* ─── FIELD LABEL ────────────────────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <label style={{
      display: "block", color: C.textMuted, fontSize: "11px", fontWeight: "700",
      letterSpacing: "0.9px", textTransform: "uppercase", marginBottom: "6px", fontFamily: FONT,
    }}>
      {children}
    </label>
  );
}

/* ─── DARK INPUT ─────────────────────────────────────────────── */
function DarkInput({ id, name, type = "text", value, onChange, required, placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id} name={name} type={type} value={value} onChange={onChange}
      required={required} placeholder={placeholder || ""} disabled={disabled}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", boxSizing: "border-box", background: C.bg,
        border: `1.5px solid ${focused ? C.pink : C.border}`, borderRadius: "10px",
        padding: "10px 14px", color: disabled ? C.textMuted : C.textPrimary, fontFamily: FONT,
        fontWeight: "600", fontSize: "13px", outline: "none",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: focused ? glow(C.pink, "18") : "none",
        opacity: disabled ? 0.6 : 1
      }}
    />
  );
}

/* ─── DARK SELECT MODAL ──────────────────────────────────────── */
function DarkSelectModal({ id, name, value, onChange, required, children, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      id={id} name={name} value={value} onChange={onChange} required={required} disabled={disabled}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", boxSizing: "border-box", background: C.bg,
        border: `1.5px solid ${focused ? C.pink : C.border}`, borderRadius: "10px",
        padding: "10px 36px 10px 14px", color: disabled ? C.textMuted : C.textPrimary,
        fontFamily: FONT, fontWeight: "600", fontSize: "13px",
        outline: "none", cursor: disabled ? "not-allowed" : "pointer",
        appearance: "none", WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C5040' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "calc(100% - 12px) center",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: focused ? glow(C.pink, "18") : "none",
        opacity: disabled ? 0.6 : 1
      }}
    >
      {children}
    </select>
  );
}

/* ─── USUARIOS MODAL ────────────────────────────────────────────── */
const DEFAULTS = { 
  nombre: '', email: '', password: '', 
  rol: 'cliente', iMesaId: ''
};

const UsuariosModal = ({ isOpen, onClose, onSave, usuario }) => {
  const [formData, setFormData] = useState(DEFAULTS);

  useEffect(() => {
    if (usuario) {
      setFormData({
        ...usuario,
        password: '', // El password está vacío por seguridad
        iMesaId: usuario.iMesaId || ''
      });
    } else {
      setFormData({ ...DEFAULTS });
    }
  }, [usuario, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isEdit = Boolean(usuario);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (isEdit && !dataToSave.password) {
      delete dataToSave.password; // No enviar password si no se cambió
    }
    // Convertir iMesaId a número o null
    if (dataToSave.iMesaId) {
      dataToSave.iMesaId = parseInt(dataToSave.iMesaId, 10);
    } else {
      dataToSave.iMesaId = null;
    }
    onSave(dataToSave);
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)", zIndex: 400,
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", zIndex: 401,
        width: "100%", maxWidth: "460px",
        maxHeight: "90vh", overflowY: "auto",
        background: C.bgCard, border: `1.5px solid ${C.borderBright}`,
        borderRadius: "20px",
        boxShadow: `0 24px 64px rgba(0,0,0,0.55), ${glow(C.pink, "18")}`,
        fontFamily: FONT,
      }}>
        <div style={{ height: "3px", background: `linear-gradient(90deg, ${C.pink}, ${C.purple})`, borderRadius: "20px 20px 0 0" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "9px",
              background: `${C.pink}18`, border: `1.5px solid ${C.pink}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UserPlus size={17} color={C.pink} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: C.textPrimary, fontWeight: "800", fontSize: "18px" }}>
                {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{
            background: C.bgCardHov, border: `1px solid ${C.border}`, borderRadius: "8px",
            padding: "6px", cursor: "pointer", display: "flex", color: C.textMuted, transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.color = C.pink; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px 24px" }}>

          <div style={{ marginBottom: "16px" }}>
            <FieldLabel>Nombre Completo</FieldLabel>
            <DarkInput id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Juan Pérez" />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <FieldLabel>Email</FieldLabel>
            <DarkInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="juan@itaquito.com" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <FieldLabel>Contraseña {isEdit && "(Opcional)"}</FieldLabel>
              <DarkInput id="password" name="password" type="password" value={formData.password} onChange={handleChange} required={!isEdit} placeholder={isEdit ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"} />
            </div>
            <div>
              <FieldLabel>Rol</FieldLabel>
              <DarkSelectModal id="rol" name="rol" value={formData.rol} onChange={handleChange} required>
                <option value="admin">Administrador</option>
                <option value="cliente">Cliente</option>
                <option value="mesero">Mesero</option>
                <option value="cajero">Cajero</option>
                <option value="taquero">Taquero (Cocinero)</option>
              </DarkSelectModal>
            </div>
          </div>

          {/* iMesaId solo si es mesero o cliente, pero opcional para todos */}
          <div style={{ marginBottom: "16px" }}>
            <FieldLabel>Mesa Asignada (ID) - Opcional</FieldLabel>
            <DarkInput id="iMesaId" name="iMesaId" type="number" value={formData.iMesaId} onChange={handleChange} placeholder="Ej. 1" />
          </div>

          <div style={{ height: "1px", background: C.border, marginBottom: "18px" }} />

          <div style={{ display: "flex", gap: "10px" }}>
            <Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancelar</Button>
            <Button type="submit" variant="primary" icon={<Save size={14} />} fullWidth>
              {isEdit ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UsuariosModal;
