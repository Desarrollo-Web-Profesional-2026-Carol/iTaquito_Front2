import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { C, FONT } from '../../../styles/designTokens';
import {
  LayoutDashboard, UtensilsCrossed, Users, TableProperties,
  BarChart3, ClipboardList, Banknote, History, Home,
  ShoppingBag, Music, Map, Lock, Globe, ChevronRight,
  ShieldCheck,
} from 'lucide-react';

/* ─── ESTRUCTURA DEL SITIO ──────────────────────────────────── */
const SITE_STRUCTURE = [
  {
    section: 'Público',
    color: C.teal,
    icon: Globe,
    description: 'Accesible sin iniciar sesión',
    pages: [
      { label: 'Inicio', path: '/', description: 'Página de bienvenida del sistema' },
      { label: 'Login', path: '/login', description: 'Autenticación de usuarios' },
      { label: 'Recuperar contraseña', path: '/reset-password', description: 'Restablecimiento de contraseña por email' },
    ],
  },
  {
    section: 'Administrador',
    color: C.pink,
    icon: ShieldCheck,
    description: 'Solo accesible para rol admin',
    pages: [
      { label: 'Dashboard', path: '/dashboard', description: 'Resumen general del negocio, ventas y estadísticas', icon: LayoutDashboard },
      { label: 'Mesas', path: '/tables', description: 'Gestión de mesas del restaurante', icon: TableProperties },
      { label: 'Menú', path: '/menu-admin', description: 'Administración de productos y categorías', icon: UtensilsCrossed },
      { label: 'Usuarios', path: '/users', description: 'Gestión de cuentas y roles del sistema', icon: Users },
    ],
  },
  {
    section: 'Mesa',
    color: C.teal,
    icon: Home,
    description: 'Acceso para clientes en mesa',
    pages: [
      { label: 'Menú', path: '/menu', description: 'Explorar y ordenar productos del menú', icon: UtensilsCrossed },
      { label: 'Mi Pedido', path: '/my-order', description: 'Ver y gestionar el pedido actual', icon: ShoppingBag },
      { label: 'Mis Órdenes', path: '/my-orders', description: 'Historial de órdenes de la sesión', icon: ClipboardList },
    ],
  },
  {
    section: 'Mesero',
    color: C.orange,
    icon: ClipboardList,
    description: 'Acceso para personal de servicio',
    pages: [
      { label: 'Mesas', path: '/tables', description: 'Ver estado de todas las mesas', icon: TableProperties },
      { label: 'Pedidos', path: '/orders', description: 'Gestión de órdenes activas', icon: ClipboardList },
    ],
  },
  {
    section: 'Cajero',
    color: C.yellow,
    icon: Banknote,
    description: 'Acceso para personal de caja',
    pages: [
      { label: 'Panel Cajero', path: '/cajero', description: 'Gestión de pagos y cobros', icon: Banknote },
      { label: 'Historial', path: '/history', description: 'Historial de transacciones', icon: History },
    ],
  },
  {
    section: 'Errores',
    color: C.purple,
    icon: Lock,
    description: 'Páginas de error del sistema',
    pages: [
      { label: 'Error 403', path: '/403', description: 'Acceso denegado — sin permisos suficientes' },
      { label: 'Error 404', path: '*', description: 'Página no encontrada' },
      { label: 'Error 500', path: '/500', description: 'Error interno del servidor' },
    ],
  },
];

/* ─── SITEMAP ───────────────────────────────────────────────── */
const Sitemap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.rol || 'guest';

  const ROLE_STYLES = {
    admin:  { bg: `${C.pink}22`,   border: `${C.pink}55`,   color: C.pink   },
    mesa:   { bg: `${C.teal}22`,   border: `${C.teal}55`,   color: C.teal   },
    mesero: { bg: `${C.orange}22`, border: `${C.orange}55`, color: C.orange },
    cajero: { bg: `${C.yellow}22`, border: `${C.yellow}55`, color: C.yellow },
  };
  const rs = ROLE_STYLES[role] || { bg: `${C.teal}22`, border: `${C.teal}55`, color: C.teal };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, fontFamily: FONT,
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* ── ENCABEZADO ── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `${C.pink}22`, border: `1.5px solid ${C.pink}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Map size={22} color={C.pink} />
            </div>
            <div>
              <h1 style={{ margin: 0, color: C.textPrimary, fontSize: '24px', fontWeight: '800' }}>
                Mapa del Sitio
              </h1>
              <p style={{ margin: 0, color: C.textMuted, fontSize: '13px' }}>
                Estructura completa de iTaquito
              </p>
            </div>
            {user && (
              <div style={{
                marginLeft: 'auto',
                background: rs.bg, border: `1px solid ${rs.border}`,
                color: rs.color, borderRadius: '10px', padding: '4px 12px',
                fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}>
                Sesión: {role}
              </div>
            )}
          </div>
          <div style={{
            height: '2px',
            background: `linear-gradient(90deg, ${C.pink}, ${C.orange}, ${C.yellow}, ${C.teal}, ${C.purple})`,
            borderRadius: '2px',
          }} />
        </div>

        {/* ── SECCIONES ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {SITE_STRUCTURE.map(({ section, color, icon: SectionIcon, description, pages }) => (
            <div key={section} style={{
              background: C.bgCard, border: `1.5px solid ${C.border}`,
              borderRadius: '16px', overflow: 'hidden',
            }}>
              {/* Header de sección */}
              <div style={{
                padding: '16px 20px',
                background: `${color}0e`,
                borderBottom: `1px solid ${color}22`,
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: `${color}22`, border: `1px solid ${color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <SectionIcon size={16} color={color} />
                </div>
                <div>
                  <div style={{ color: C.textPrimary, fontWeight: '800', fontSize: '15px' }}>
                    {section}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: '12px' }}>{description}</div>
                </div>
              </div>

              {/* Páginas */}
              <div style={{ padding: '8px' }}>
                {pages.map(({ label, path, description: pageDesc, icon: PageIcon }) => (
                  <div
                    key={path}
                    onClick={() => path !== '*' && navigate(path)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 12px', borderRadius: '10px',
                      cursor: path !== '*' ? 'pointer' : 'default',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (path !== '*') e.currentTarget.style.background = `${color}0e`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {PageIcon && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '7px',
                        background: `${color}15`, border: `1px solid ${color}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <PageIcon size={13} color={color} />
                      </div>
                    )}
                    {!PageIcon && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '7px',
                        background: `${color}15`, border: `1px solid ${color}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Globe size={13} color={color} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.textPrimary, fontWeight: '700', fontSize: '13px' }}>
                        {label}
                      </div>
                      <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '1px' }}>
                        {pageDesc}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'monospace', fontSize: '11px',
                      color: color, background: `${color}12`,
                      border: `1px solid ${color}33`,
                      borderRadius: '6px', padding: '2px 8px',
                      flexShrink: 0,
                    }}>
                      {path}
                    </div>
                    {path !== '*' && (
                      <ChevronRight size={14} color={C.textMuted} style={{ flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          marginTop: '40px', textAlign: 'center',
          color: C.textMuted, fontSize: '12px',
        }}>
          iTaquito · {new Date().getFullYear()} · {SITE_STRUCTURE.reduce((acc, s) => acc + s.pages.length, 0)} páginas registradas
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          div[style*="monospace"] { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Sitemap;