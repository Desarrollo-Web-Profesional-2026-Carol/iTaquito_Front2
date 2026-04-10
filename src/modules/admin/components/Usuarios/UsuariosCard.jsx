import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { C, FONT, glow, ROLE_COLORS } from '../../../../styles/designTokens';
import {
  Pencil, UserMinus, User, Shield, Coffee, CreditCard,
  ChefHat, Mail, UtensilsCrossed, ShieldCheck, ShieldOff, KeyRound,
} from 'lucide-react';

/* ─── ICONS POR ROL ──────────────────────────────────────────── */
const ROLE_ICONS = {
  admin:   Shield,
  mesero:  Coffee,
  cajero:  CreditCard,
  taquero: ChefHat,
  mesa:    User,
};

const ACTION_LABELS = {
  admin:   'Admin',
  mesero:  'Mesero',
  cajero:  'Cajero',
  taquero: 'Taquero',
  mesa:    'Mesa',
};

/* ─── AVATAR CON INICIALES ───────────────────────────────────── */
function Avatar({ nombre, color }) {
  const initials = nombre
    ? nombre.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
    : '?';

  return (
    <div style={{
      width: '52px', height: '52px', borderRadius: '14px',
      background: `${color}20`, border: `2px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, fontFamily: FONT, fontWeight: '800',
      fontSize: '18px', color, letterSpacing: '-0.5px',
    }}>
      {initials}
    </div>
  );
}

/* ─── INFO ROW ───────────────────────────────────────────────── */
function InfoRow({ Icon, text, color = C.teal }) {
  if (!text) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textSecondary, fontSize: '12.5px' }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '6px',
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={12} color={color} />
      </div>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {text}
      </span>
    </div>
  );
}

/* ─── ACTION BUTTON ──────────────────────────────────────────── */
function ActionBtn({ label, Icon, color, onClick, disabled = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: '1',
        background:     hov ? `${color}22` : `${color}0E`,
        border:         `1.5px solid ${hov ? color : color + '40'}`,
        borderRadius:   '9px',
        padding:        '8px 10px',
        color:          disabled ? C.textMuted : color,
        fontFamily:     FONT,
        fontWeight:     '700',
        fontSize:       '12px',
        cursor:         disabled ? 'not-allowed' : 'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '5px',
        transition:     'all 0.18s ease',
        boxShadow:      hov ? glow(color, '22') : 'none',
        opacity:        disabled ? 0.45 : 1,
      }}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

/* ─── USUARIOS CARD ──────────────────────────────────────────── */
const UsuariosCard = ({ usuario, onEdit, onDelete, on2FA, onResetPassword }) => {
  const { user } = useAuth();
  const isAdmin  = user?.rol === 'admin';
  const [hov, setHov] = useState(false);

  const roleKey   = usuario.rol || 'mesa';
  const colorKey  = ROLE_COLORS[roleKey] || C.teal;
  const RoleIcon  = ROLE_ICONS[roleKey]  || User;
  const roleLabel = ACTION_LABELS[roleKey] || roleKey.charAt(0).toUpperCase() + roleKey.slice(1);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:    hov ? C.bgCardHov : C.bgCard,
        border:        `1.5px solid ${hov ? colorKey : C.border}`,
        borderRadius:  '18px',
        overflow:      'hidden',
        display:       'flex',
        flexDirection: 'column',
        transform:     hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:     hov
          ? `0 14px 36px rgba(0,0,0,0.38), 0 0 20px ${colorKey}18`
          : '0 2px 10px rgba(0,0,0,0.25)',
        transition:    'all 0.22s ease',
        fontFamily:    FONT,
      }}
    >
      {/* Barra de color superior */}
      <div style={{ height: '5px', background: `linear-gradient(90deg, ${colorKey}, ${colorKey}88)` }} />

      <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Avatar + Nombre + Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
          <Avatar nombre={usuario.nombre} color={colorKey} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              margin: '0 0 5px', color: C.textPrimary, fontWeight: '800',
              fontSize: '16px', lineHeight: 1.2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {usuario.nombre}
            </h3>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: `${colorKey}18`, border: `1px solid ${colorKey}50`,
              color: colorKey, borderRadius: '20px', padding: '2px 10px',
              fontSize: '11px', fontWeight: '700', letterSpacing: '0.4px',
            }}>
              <RoleIcon size={11} /> {roleLabel}
            </span>
          </div>
        </div>

        {/* Separador */}
        <div style={{ height: '1px', background: C.border, margin: '0 -2px' }} />

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          <InfoRow Icon={Mail} text={usuario.email} color={colorKey} />
          {usuario.iMesaId != null && (
            <InfoRow
              Icon={UtensilsCrossed}
              text={usuario.mesa ? `Lugar: ${usuario.mesa.sNombre}` : `Lugar: ${usuario.iMesaId}`}
              color={C.orange}
            />
          )}
        </div>

        {/* Badge 2FA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            background: usuario.twoFactorEnabled ? `${C.teal}12` : C.border,
            border: `1px solid ${usuario.twoFactorEnabled ? C.teal + '44' : C.border}`,
            borderRadius: '20px', padding: '2px 8px',
            color: usuario.twoFactorEnabled ? C.teal : C.textMuted,
            fontSize: '10px', fontWeight: '700',
          }}>
            {usuario.twoFactorEnabled ? <ShieldCheck size={10} /> : <ShieldOff size={10} />}
            {usuario.twoFactorEnabled ? '2FA activo' : '2FA inactivo'}
          </span>
        </div>

        {/* Acciones — solo si es admin */}
        {isAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '2px' }}>
            {/* Fila 1: Editar + Eliminar */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <ActionBtn
                label="Editar"
                Icon={Pencil}
                color={colorKey}
                onClick={() => onEdit(usuario)}
              />
              <ActionBtn
                label="Eliminar"
                Icon={UserMinus}
                color={C.error}
                onClick={() => onDelete(usuario.id)}
                disabled={usuario.id === user?.id}
              />
            </div>
            {/* Fila 2: 2FA + Contraseña */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <ActionBtn
                label={usuario.twoFactorEnabled ? 'Gestionar 2FA' : 'Activar 2FA'}
                Icon={Shield}
                color={C.purple}
                onClick={() => on2FA && on2FA(usuario)}
              />
              <ActionBtn
                label="Contraseña"
                Icon={KeyRound}
                color={C.orange}
                onClick={() => onResetPassword && onResetPassword(usuario)}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UsuariosCard;