import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { C, FONT, glow, ROLE_COLORS } from '../../../../styles/designTokens';
import { Pencil, UserMinus, User, Shield, Coffee, CreditCard, ChefHat } from 'lucide-react';

/* ─── ICONS POR ROL ──────────────────────────────────────────── */
const ROLE_ICONS = {
  admin:   Shield,
  mesero:  Coffee,
  cajero:  CreditCard,
  taquero: ChefHat,
  cliente: User,
};

const ACTION_LABELS = {
  admin:   "Admin",
  mesero:  "Mesero",
  cajero:  "Cajero",
  taquero: "Taquero",
  cliente: "Cliente",
};

/* ─── ACTION BUTTON ──────────────────────────────────────────── */
function ActionBtn({ label, Icon, color, onClick, fullWidth = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: fullWidth ? "1 1 100%" : "1",
        background:     hov ? `${color}22` : `${color}12`,
        border:         `1.5px solid ${hov ? color : color + "44"}`,
        borderRadius:   "9px",
        padding:        "8px 12px",
        color,
        fontFamily:     FONT,
        fontWeight:     "700",
        fontSize:       "12px",
        cursor:         "pointer",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "5px",
        transition:     "all 0.18s ease",
        boxShadow:      hov ? glow(color, "22") : "none",
      }}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

/* ─── USUARIOS CARD ─────────────────────────────────────────────── */
const UsuariosCard = ({ usuario, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';
  const [hov, setHov] = useState(false);

  const roleKey = usuario.rol || 'cliente';
  const colorKey = ROLE_COLORS[roleKey] || C.teal;
  const RoleIcon = ROLE_ICONS[roleKey] || User;
  const roleLabel = ACTION_LABELS[roleKey] || roleKey.charAt(0).toUpperCase() + roleKey.slice(1);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:    hov ? C.bgCardHov : C.bgCard,
        border:        `1.5px solid ${hov ? colorKey : C.border}`,
        borderRadius:  "16px",
        overflow:      "hidden",
        display:       "flex",
        flexDirection: "column",
        transform:     hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow:     hov
          ? `0 12px 32px rgba(0,0,0,0.35), ${glow(colorKey, "18")}`
          : "0 2px 8px rgba(0,0,0,0.25)",
        transition: "all 0.22s ease",
        fontFamily: FONT,
      }}
    >
      <div style={{ height: "4px", background: colorKey, boxShadow: `0 0 8px ${colorKey}` }} />
      <div style={{ padding: "18px 18px 16px" }}>

        {/* Nombre + Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
          <h3 style={{ margin: 0, color: C.textPrimary, fontWeight: "800", fontSize: "17px", lineHeight: 1.2 }}>
            {usuario.nombre}
          </h3>
          <span style={{
            background:   `${colorKey}18`,
            border:       `1px solid ${colorKey}55`,
            color:         colorKey,
            borderRadius: "20px",
            padding:      "3px 10px",
            fontSize:     "11px",
            fontWeight:   "700",
            letterSpacing:"0.4px",
            whiteSpace:   "nowrap",
            flexShrink:    0,
            marginLeft:   "10px",
            display:      "flex",
            alignItems:   "center",
            gap:          "4px"
          }}>
            <RoleIcon size={12} />
            {roleLabel}
          </span>
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
          {/* Email */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.textSecondary, fontSize: "13px" }}>
            <div style={{
              width: "26px", height: "26px", borderRadius: "7px",
              background: `${C.teal}15`, border: `1px solid ${C.teal}30`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <User size={13} color={C.teal} />
            </div>
            <span>{usuario.email}</span>
          </div>

          {/* iMesaId opcional */}
          {usuario.iMesaId != null && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.textMuted, fontSize: "12px" }}>
               <span style={{ paddingLeft: "34px" }}>Mesa asignada: {usuario.iMesaId}</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
          {isAdmin && (
            <>
              <ActionBtn label="Editar" Icon={Pencil} color={colorKey} onClick={() => onEdit(usuario)} />
              {usuario.id !== user?.id && (
                <ActionBtn label="Eliminar" Icon={UserMinus} color={C.error} onClick={() => onDelete(usuario.id)} />
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default UsuariosCard;
