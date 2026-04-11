import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { C, FONT } from "../../styles/designTokens";
import { Map } from 'lucide-react';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  BarChart3,
  TableProperties,
  ClipboardList,
  Music,
  Home,
  ShoppingBag,
  Receipt,
  Banknote,
  History,
  ChevronDown,
  ChefHat,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

/* ─── MODAL DE CONFIRMACIÓN ──────────────────────────────────── */
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, loading, confirmLabel = 'Confirmar', confirmColor = C.pink }) {
  if (!isOpen) return null;
  
  return (
    <>
      <div onClick={onCancel} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)', zIndex: 1000,
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', zIndex: 1001,
        width: '100%', maxWidth: '400px',
        background: C.bgCard, border: `1.5px solid ${C.borderBright}`,
        borderRadius: '18px', padding: '28px 28px 24px',
        fontFamily: FONT, boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: `${confirmColor}18`, border: `1px solid ${confirmColor}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '14px',
        }}>
          <LogOut size={20} color={confirmColor} />
        </div>
        <h3 style={{ margin: '0 0 8px', color: C.textPrimary, fontSize: '17px', fontWeight: '800' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 24px', color: C.textSecondary, fontSize: '14px', lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, background: 'none', border: `1.5px solid ${C.border}`,
              borderRadius: '10px', padding: '11px', color: C.textSecondary,
              fontFamily: FONT, fontWeight: '700', fontSize: '13px', cursor: 'pointer',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, background: confirmColor, border: 'none',
              borderRadius: '10px', padding: '11px', color: '#fff',
              fontFamily: FONT, fontWeight: '700', fontSize: '13px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            }}
          >
            {loading
              ? <><RefreshCw size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Procesando...</>
              : confirmLabel
            }
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ message, type = 'success', onClose }) {
  useState(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const color = type === 'success' ? C.teal : C.pink;
  const Icon = type === 'success' ? '✓' : '✕';

  return (
    <div style={{
      position: 'fixed', bottom: '28px', right: '28px', zIndex: 1002,
      background: C.bgCard, border: `1.5px solid ${color}55`,
      borderRadius: '14px', padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: '10px',
      fontFamily: FONT, boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${color}22`,
      animation: 'slideIn 0.3s ease', maxWidth: '340px',
    }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '9px',
        background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color, fontWeight: '800', fontSize: '12px',
      }}>
        {Icon}
      </div>
      <span style={{ color: C.textPrimary, fontSize: '13px', fontWeight: '600' }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: C.textMuted,
        cursor: 'pointer', marginLeft: 'auto', padding: '2px',
      }}>
        <span style={{ fontSize: '14px' }}>✕</span>
      </button>
    </div>
  );
}

/* ─── NAV CONFIG POR ROL ─────────────────────────────────────── */
const NAV_CONFIG = {
  admin: {
    label: "Administrador",
    accentColor: C.pink,
    links: [
      { label: "Dashboard", path: "/dashboard", Icon: LayoutDashboard },
      { label: "Mesas", path: "/tables", Icon: TableProperties },
      { label: "Menú", path: "/menu", Icon: UtensilsCrossed },
      { label: "Usuarios", path: "/users", Icon: Users },
      { label: "Reportes", path: "/reports", Icon: BarChart3 },
      { label: 'Mapa de sitio', path: '/sitemap', Icon: Map },

    ],
  },
  mesa: {
    label: "Mesa",
    accentColor: C.teal,
    links: [
      { label: "Inicio", path: "/home", Icon: Home },
      { label: "Menú", path: "/menu", Icon: UtensilsCrossed },
      { label: "Mi Pedido", path: "/my-orders", Icon: ShoppingBag },
      { label: "Canciones", path: "/songs", Icon: Music },
    ],
  },
  mesero: {
    label: "Mesero",
    accentColor: C.orange,
    links: [
      { label: "Mesas", path: "/tables", Icon: TableProperties },
      { label: "Pedidos", path: "/orders", Icon: ClipboardList },
      { label: "Canciones", path: "/songs", Icon: Music },
    ],
  },
  cajero: {
    label: "Cajero",
    accentColor: C.yellow,
    links: [
      { label: "Cajero", path: "/cajero", Icon: Banknote },
      { label: "Historial", path: "/history", Icon: History },
    ],
  },
};

/* ─── ROLE BADGE COLORS ──────────────────────────────────────── */
const ROLE_STYLES = {
  admin: { bg: `${C.pink}22`, border: `${C.pink}55`, color: C.pink },
  mesa: { bg: `${C.teal}22`, border: `${C.teal}55`, color: C.teal },
  mesero: { bg: `${C.orange}22`, border: `${C.orange}55`, color: C.orange },
  cajero: { bg: `${C.yellow}22`, border: `${C.yellow}55`, color: C.yellow },
};

/* ─── HEADER ─────────────────────────────────────────────────── */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false, title: '', message: '', onConfirm: null, loading: false,
    confirmLabel: 'Confirmar', confirmColor: C.pink,
  });
  const [toast, setToast] = useState(null);

  // Detecta el rol del usuario (ajusta según tu AuthContext)
  const role = user?.rol || "mesa";
  const config = NAV_CONFIG[role] || NAV_CONFIG.mesa;
  const rs = ROLE_STYLES[role] || ROLE_STYLES.mesa;

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleLogout = () => {
    setConfirmModal({
      open: true,
      title: 'Cerrar sesión',
      message: '¿Estás seguro que deseas cerrar sesión? Tendrás que iniciar sesión nuevamente para acceder al sistema.',
      confirmLabel: 'Sí, cerrar sesión',
      confirmColor: C.pink,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(p => ({ ...p, loading: true }));
        try {
          await logout();
          setConfirmModal(p => ({ ...p, open: false }));
          navigate('/login');
        } catch (error) {
          console.error('Error en logout:', error);
          showToast('Error al cerrar sesión. Por favor intenta de nuevo.', 'error');
          setConfirmModal(p => ({ ...p, open: false, loading: false }));
        }
      },
    });
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
    setUserOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getUserInitial = () => user?.nombre?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <header
        style={{
          background: C.bgAccent,
          borderBottom: `1px solid ${C.border}`,
          position: "sticky",
          top: 0,
          zIndex: 200,
          boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
          fontFamily: FONT,
        }}
      >
        {/* Neon top strip con el color del rol */}
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, ${config.accentColor}, ${config.accentColor}88, transparent)`,
            boxShadow: 'none',
          }}
        />

        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            height: "56px",
            gap: "24px",
          }}
        >
          {/* ── LOGO ── */}
          <div
            onClick={() => handleNav(config.links[0].path)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                background: config.accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 'none',
              }}
            >
              <UtensilsCrossed size={17} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  color: C.cream,
                  fontWeight: "800",
                  fontSize: "17px",
                  lineHeight: 1,
                  letterSpacing: "0.3px",
                }}
              >
                iTaquito
              </div>
              {/* Badge de rol */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: rs.bg,
                  border: `1px solid ${rs.border}`,
                  color: rs.color,
                  borderRadius: "10px",
                  padding: "1px 7px",
                  fontSize: "9px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  marginTop: "2px",
                }}
              >
                {config.label}
              </div>
            </div>
          </div>

          {/* ── NAV DESKTOP ── */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              flex: 1,
            }}
            className="desktop-nav"
          >
            {config.links.map(({ label, path, Icon }) => {
              const active = isActive(path);
              return (
                <button
                  key={path}
                  onClick={() => handleNav(path)}
                  style={{
                    background: active
                      ? `${config.accentColor}18`
                      : "transparent",
                    color: active ? config.accentColor : C.textSecondary,
                    border: `1px solid ${active ? config.accentColor + "44" : "transparent"}`,
                    borderRadius: "8px",
                    padding: "6px 14px",
                    fontFamily: FONT,
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    boxShadow: active
                      ? `0 0 10px ${config.accentColor}22`
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = C.textPrimary;
                      e.currentTarget.style.background = `${C.border}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = C.textSecondary;
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* ── SPACER ── */}
          <div style={{ flex: 1 }} />

          {/* ── USER MENU ── */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setUserOpen((o) => !o)}
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: "10px",
                padding: "5px 10px 5px 6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = config.accentColor + "66")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = C.border)
              }
            >
              {/* Avatar */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "7px",
                  background: `${config.accentColor}33`,
                  border: `1.5px solid ${config.accentColor}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: config.accentColor,
                  fontWeight: "800",
                  fontSize: "13px",
                }}
              >
                {getUserInitial()}
              </div>
              <span
                style={{
                  color: C.textPrimary,
                  fontSize: "13px",
                  fontWeight: "600",
                  fontFamily: FONT,
                }}
              >
                {user?.nombre || "Usuario"}
              </span>
              <ChevronDown
                size={13}
                color={C.textMuted}
                style={{
                  transform: userOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {/* Dropdown */}
            {userOpen && (
              <>
                <div
                  onClick={() => setUserOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 299 }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    borderRadius: "12px",
                    padding: "6px",
                    minWidth: "180px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    zIndex: 300,
                  }}
                >
                  {/* Info usuario */}
                  <div
                    style={{
                      padding: "10px 12px 8px",
                      borderBottom: `1px solid ${C.border}`,
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        color: C.textPrimary,
                        fontWeight: "700",
                        fontSize: "13px",
                      }}
                    >
                      {user?.nombre || "Usuario"}
                    </div>
                    <div
                      style={{
                        color: C.textMuted,
                        fontSize: "11px",
                        marginTop: "2px",
                      }}
                    >
                      {user?.email || ""}
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        marginTop: "6px",
                        background: rs.bg,
                        border: `1px solid ${rs.border}`,
                        color: rs.color,
                        borderRadius: "8px",
                        padding: "1px 8px",
                        fontSize: "10px",
                        fontWeight: "700",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {config.label}
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: C.pink,
                      fontFamily: FONT,
                      fontWeight: "600",
                      fontSize: "13px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = `${C.pink}12`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <LogOut size={14} /> Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── HAMBURGER (móvil) ── */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              color: C.textPrimary,
              flexShrink: 0,
            }}
            id="hamburger-btn"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "59px",
            left: 0,
            right: 0,
            background: C.bgCard,
            borderBottom: `1px solid ${C.border}`,
            zIndex: 199,
            padding: "12px 16px 16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            fontFamily: FONT,
          }}
        >
          {config.links.map(({ label, path, Icon }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => handleNav(path)}
                style={{
                  width: "100%",
                  background: active
                    ? `${config.accentColor}18`
                    : "transparent",
                  color: active ? config.accentColor : C.textSecondary,
                  border: `1px solid ${active ? config.accentColor + "44" : C.border}`,
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "6px",
                  fontFamily: FONT,
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textAlign: "left",
                  boxShadow: active
                    ? `0 0 10px ${config.accentColor}22`
                    : "none",
                }}
              >
                <Icon size={16} /> {label}
              </button>
            );
          })}

          {/* Logout en móvil */}
          <div
            style={{
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                background: `${C.pink}12`,
                border: `1px solid ${C.pink}33`,
                borderRadius: "10px",
                padding: "12px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: C.pink,
                fontFamily: FONT,
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => !confirmModal.loading && setConfirmModal(p => ({ ...p, open: false }))}
        loading={confirmModal.loading}
        confirmLabel={confirmModal.confirmLabel}
        confirmColor={confirmModal.confirmColor}
      />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── ESTILOS RESPONSIVE ── */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          #hamburger-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          #hamburger-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Header;

