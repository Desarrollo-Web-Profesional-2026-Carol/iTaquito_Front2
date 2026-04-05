import { useState, useEffect } from 'react';
import { C, FONT, glow } from '../../../../styles/designTokens';
import { X, Save, UserPlus, UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { usersService } from '../../../../services/user';
import React from 'react';

/* ─── FIELD LABEL ────────────────────────────────────────────── */
function FieldLabel({ children, required }) {
  return (
    <label style={{
      display: "block", color: C.textMuted, fontSize: "11px", fontWeight: "700",
      letterSpacing: "0.9px", textTransform: "uppercase", marginBottom: "6px", fontFamily: FONT,
    }}>
      {children}
      {required && <span style={{ color: C.pink, marginLeft: "4px" }}>*</span>}
    </label>
  );
}

/* ─── DARK INPUT CON OPCION DE VER CONTRASEÑA (SOLO NUEVA) ──── */
function PasswordInput({ id, name, value, onChange, required, placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        id={id} name={name} 
        type={showPassword ? "text" : "password"} 
        value={value} 
        onChange={onChange}
        required={required} 
        placeholder={placeholder || ""} 
        disabled={disabled}
        onFocus={() => setFocused(true)} 
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box", background: C.bg,
          border: `1.5px solid ${focused ? C.pink : C.border}`, borderRadius: "10px",
          padding: "10px 40px 10px 14px", 
          color: disabled ? C.textMuted : C.textPrimary, fontFamily: FONT,
          fontWeight: "600", fontSize: "13px", outline: "none",
          transition: "border-color 0.18s, box-shadow 0.18s",
          boxShadow: focused ? glow(C.pink, "18") : "none",
          opacity: disabled ? 0.6 : 1,
        }}
      />
      
      {/* Botón para ver la contraseña que se está escribiendo */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", padding: "0",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.textMuted, transition: "color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.pink}
        onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
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
        opacity: disabled ? 0.6 : 1,
      }}
    />
  );
}

/* ─── DARK SELECT ────────────────────────────────────────────── */
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
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </select>
  );
}

/* ─── MESA SELECTOR ──────────────────────────────────────────── */
function MesaSelector({ value, onChange, mesas, loading, rol, isEdit, currentMesaId }) {
  // Ordenar mesas para poner la mesa actual primero
  const sortedMesas = React.useMemo(() => {
    if (!mesas.length) return [];
    
    if (isEdit && currentMesaId) {
      const currentMesa = mesas.find(m => m.id === currentMesaId);
      if (currentMesa) {
        const otherMesas = mesas.filter(m => m.id !== currentMesaId);
        return [currentMesa, ...otherMesas];
      }
    }
    return mesas;
  }, [mesas, currentMesaId, isEdit]);

  const selectedMesa = mesas.find(m => m.id === value);
  const isRequired = rol === 'mesa';

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ position: "relative" }}>
        <UtensilsCrossed
          size={14} color={C.textMuted}
          style={{
            position: "absolute", left: "12px", top: "50%",
            transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1,
          }}
        />
        <select
          value={value ?? ""}
          onChange={e => onChange(e.target.value === "" ? null : Number(e.target.value))}
          disabled={loading}
          required={isRequired}
          style={{
            width: "100%", boxSizing: "border-box", background: C.bg,
            border: `1.5px solid ${value ? C.orange : (isRequired && !value ? C.error : C.border)}`, 
            borderRadius: "10px",
            padding: "10px 36px 10px 36px",
            color: value ? C.textPrimary : C.textMuted,
            fontFamily: FONT, fontWeight: "600", fontSize: "13px",
            outline: "none", cursor: loading ? "wait" : "pointer",
            appearance: "none", WebkitAppearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C5040' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat", backgroundPosition: "calc(100% - 12px) center",
            transition: "border-color 0.18s, box-shadow 0.18s",
            boxShadow: value ? `0 0 0 3px ${C.orange}18` : "none",
          }}
        >
          <option value="">{isRequired ? "Selecciona una mesa (Obligatorio)" : "Sin mesa asignada"}</option>
          {loading
            ? <option disabled>Cargando mesas...</option>
            : sortedMesas.length === 0
              ? <option disabled>No hay mesas disponibles</option>
              : sortedMesas.map((m, index) => (
                  <option key={m.id} value={m.id}>
                    {m.sNombre || m.nombre || m.numero || `Mesa #${m.id}`}
                    {isEdit && currentMesaId === m.id && index === 0 ? " (Mesa actual)" : ""}
                  </option>
                ))
          }
        </select>
      </div>

      {/* Mensaje de validación para mesas */}
      {isRequired && !value && !loading && (
        <div style={{
          fontSize: "11px",
          color: C.error,
          marginTop: "4px",
          paddingLeft: "8px",
        }}>
          ⚠️ Los mesas deben tener una mesa asignada
        </div>
      )}

      {/* Preview de mesa seleccionada */}
      {selectedMesa && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: isEdit && currentMesaId === selectedMesa.id ? `${C.pink}10` : `${C.orange}10`,
          border: `1px solid ${isEdit && currentMesaId === selectedMesa.id ? C.pink : C.orange}35`,
          borderRadius: "8px", padding: "8px 12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "7px",
              background: isEdit && currentMesaId === selectedMesa.id ? `${C.pink}20` : `${C.orange}20`,
              border: `1px solid ${isEdit && currentMesaId === selectedMesa.id ? C.pink : C.orange}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UtensilsCrossed size={13} color={isEdit && currentMesaId === selectedMesa.id ? C.pink : C.orange} />
            </div>
            <span style={{ color: C.textPrimary, fontWeight: "700", fontSize: "13px", fontFamily: FONT }}>
              {selectedMesa.sNombre || selectedMesa.nombre || selectedMesa.numero || `Mesa #${selectedMesa.id}`}
              {isEdit && currentMesaId === selectedMesa.id && (
                <span style={{ 
                  marginLeft: "8px", 
                  fontSize: "10px", 
                  fontWeight: "500",
                  color: C.pink,
                  background: `${C.pink}15`,
                  padding: "2px 6px",
                  borderRadius: "10px",
                }}>
                  Actual
                </span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: C.textMuted, display: "flex", padding: "2px",
              borderRadius: "4px", transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.error}
            onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── DEFAULTS ───────────────────────────────────────────────── */
const DEFAULTS = { nombre: '', email: '', password: '', rol: 'mesa', iMesaId: null };

/* ─── USUARIOS MODAL ─────────────────────────────────────────── */
const UsuariosModal = ({ isOpen, onClose, onSave, usuario }) => {
  const [formData, setFormData] = useState(DEFAULTS);
  const [mesas, setMesas] = useState([]);
  const [mesasLoading, setMesasLoading] = useState(false);

  /* Cargar mesas disponibles incluyendo la mesa actual si el usuario ya tiene una */
  useEffect(() => {
    if (!isOpen) return;
    
    const loadMesas = async () => {
      setMesasLoading(true);
      try {
        let data;
        
        if (usuario?.iMesaId) {
          try {
            data = await usersService.getAllMesas?.();
          } catch (error) {
            console.log('No se pudo obtener todas las mesas');
          }
          
          if (!data || !data.find(m => m.id === usuario.iMesaId)) {
            const mesasDisponibles = await usersService.getMesasDisponibles();
            const mesaActual = { 
              id: usuario.iMesaId, 
              sNombre: usuario.mesa?.sNombre || `Mesa #${usuario.iMesaId}`,
              isCurrent: true 
            };
            data = [mesaActual, ...(mesasDisponibles || [])];
          }
        } else {
          data = await usersService.getMesasDisponibles();
        }
        
        setMesas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar mesas:', err);
        setMesas([]);
      } finally {
        setMesasLoading(false);
      }
    };
    
    loadMesas();
  }, [isOpen, usuario?.iMesaId]);

  /* Rellenar form */
  useEffect(() => {
    if (usuario) {
      setFormData({ 
        ...usuario, 
        password: '', // Campo vacío para nueva contraseña
        iMesaId: usuario.iMesaId ?? null 
      });
    } else {
      setFormData({ ...DEFAULTS });
    }
  }, [usuario, isOpen]);

  if (!isOpen) return null;

  const isEdit = Boolean(usuario);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que los mesas tengan mesa asignada
    if (formData.rol === 'mesa' && !formData.iMesaId) {
      alert('Los mesas deben tener una mesa asignada');
      return;
    }
    
    const dataToSave = { ...formData };
    // Si no se ingresó nueva contraseña, no la enviamos
    if (isEdit && !dataToSave.password) {
      delete dataToSave.password;
    }
    dataToSave.iMesaId = formData.iMesaId ?? null;
    onSave(dataToSave);
  };

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)", zIndex: 400,
      }} />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", zIndex: 401,
        width: "100%", maxWidth: "480px",
        maxHeight: "90vh", overflowY: "auto",
        background: C.bgCard, border: `1.5px solid ${C.borderBright}`,
        borderRadius: "20px",
        boxShadow: `0 24px 64px rgba(0,0,0,0.55), ${glow(C.pink, "18")}`,
        fontFamily: FONT,
      }}>

        {/* Barra superior */}
        <div style={{
          height: "3px",
          background: `linear-gradient(90deg, ${C.pink}, ${C.purple})`,
          borderRadius: "20px 20px 0 0",
        }} />

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "20px 24px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "9px",
              background: `${C.pink}18`, border: `1.5px solid ${C.pink}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UserPlus size={17} color={C.pink} />
            </div>
            <h2 style={{ margin: 0, color: C.textPrimary, fontWeight: "800", fontSize: "18px" }}>
              {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
          </div>
          <button type="button" onClick={onClose} style={{
            background: C.bgCardHov, border: `1px solid ${C.border}`,
            borderRadius: "8px", padding: "6px", cursor: "pointer",
            display: "flex", color: C.textMuted, transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.color = C.pink; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Nombre */}
          <div>
            <FieldLabel required>Nombre Completo</FieldLabel>
            <DarkInput
              id="nombre" name="nombre" value={formData.nombre}
              onChange={handleChange} required placeholder="Juan Pérez"
            />
          </div>

          {/* Email */}
          <div>
            <FieldLabel required>Email</FieldLabel>
            <DarkInput
              id="email" name="email" type="email" value={formData.email}
              onChange={handleChange} required placeholder="juan@itaquito.com"
            />
          </div>

          {/* Contraseña + Rol */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <FieldLabel required={!isEdit}>
                Contraseña {isEdit && "(Nueva, opcional)"}
              </FieldLabel>
              <PasswordInput
                id="password" name="password" value={formData.password}
                onChange={handleChange} required={!isEdit}
                placeholder={isEdit ? "Nueva contraseña (dejar vacío para mantener)" : "Mínimo 6 caracteres"}
              />
            </div>
            <div>
              <FieldLabel required>Rol</FieldLabel>
              <DarkSelectModal
                id="rol" name="rol" value={formData.rol}
                onChange={handleChange} required
              >
                <option value="admin">Administrador</option>
                <option value="mesa">Mesa</option>
                <option value="mesero">Mesero</option>
                <option value="cajero">Cajero</option>
                <option value="taquero">Taquero (Cocinero)</option>
              </DarkSelectModal>
            </div>
          </div>

          {/* Mesa asignada */}
          <div>
            <FieldLabel required={formData.rol === 'mesa'}>
              Mesa Asignada {formData.rol === 'mesa' && "(Obligatoria)"}
            </FieldLabel>
            <MesaSelector
              value={formData.iMesaId}
              onChange={val => setFormData(prev => ({ ...prev, iMesaId: val }))}
              mesas={mesas}
              loading={mesasLoading}
              rol={formData.rol}
              isEdit={isEdit}
              currentMesaId={usuario?.iMesaId}
            />
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: C.border }} />

          {/* Botones */}
          <div style={{ display: "flex", gap: "10px" }}>
            <Button type="button" variant="secondary" onClick={onClose} fullWidth>
              Cancelar
            </Button>
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



