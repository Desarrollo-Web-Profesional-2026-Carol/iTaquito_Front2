import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ordersService } from '../services/orders';
import { C, FONT, glow } from '../styles/designTokens';
import {
  ClipboardList, UtensilsCrossed, ShoppingBag,
  Clock, CheckCircle, ChefHat, Truck, XCircle,
  RefreshCw, MapPin, LogOut, Utensils, Plus
} from 'lucide-react';

/* ─── ESTADO CONFIG ──────────────────────────────────────────── */
const ESTADO = {
  pendiente:      { label: 'Pendiente',      color: C.yellow,    Icon: Clock       },
  en_preparacion: { label: 'En preparación', color: C.orange,    Icon: ChefHat     },
  listo:          { label: '¡Listo!',        color: C.teal,      Icon: CheckCircle },
  entregado:      { label: 'Entregado',      color: C.textMuted, Icon: Truck       },
  cancelado:      { label: 'Cancelado',      color: C.pink,      Icon: XCircle     },
};

/* ─── NAV BUTTON ─────────────────────────────────────────────── */
function NavBtn({ label, active, color, onClick, children }) {
  const [hov, setHov] = useState(false);
  const c = color || C.teal;
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: active ? `${c}18` : hov ? C.bgCardHov : 'transparent', border: `1.5px solid ${active ? c + '55' : hov ? C.border : 'transparent'}`, borderRadius: '8px', padding: '6px 12px', color: active ? c : hov ? C.textPrimary : C.textSecondary, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s', flexShrink: 0 }}>
      {children} {label}
    </button>
  );
}

/* ─── CLIENT HEADER ──────────────────────────────────────────── */
function ClientHeader({ user, totalItems, onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header style={{ background: C.bgAccent, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 2px 16px rgba(0,0,0,0.4)', fontFamily: FONT }}>
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${C.teal}, ${C.teal}88, transparent)`, boxShadow: `0 0 10px ${C.teal}66` }} />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px', height: '54px', display: 'flex', alignItems: 'center', gap: '12px' }}>

        <div onClick={() => navigate('/menu')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${C.teal}22`, border: `1.5px solid ${C.teal}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glow(C.teal, '33') }}>
            <Utensils size={15} color={C.teal} />
          </div>
          <span style={{ color: C.cream, fontWeight: '800', fontSize: '16px' }}>iTaquito</span>
        </div>

        {(user?.mesa || user?.iMesaId) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `${C.teal}12`, border: `1px solid ${C.teal}33`, borderRadius: '20px', padding: '4px 10px', color: C.teal, fontSize: '12px', fontWeight: '700' }}>
            <MapPin size={11} /> {user.mesa?.sNombre || `Mesa ${user.iMesaId}`}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <NavBtn label="Menú"        active={pathname === '/menu'}       color={C.teal}   onClick={() => navigate('/menu')}>
          <UtensilsCrossed size={14} />
        </NavBtn>

     

        <NavBtn label="Mis Pedidos" active={pathname === '/my-orders'}  color={C.purple} onClick={() => navigate('/my-orders')}>
          <ClipboardList size={14} />
        </NavBtn>

        <button onClick={onLogout}
          style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}33`, borderRadius: '8px', padding: '6px 12px', color: C.pink, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = `${C.pink}22`; e.currentTarget.style.borderColor = C.pink; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${C.pink}12`; e.currentTarget.style.borderColor = `${C.pink}33`; }}>
          <LogOut size={13} /> Salir
        </button>
      </div>
    </header>
  );
}

/* ─── STATUS BADGE ───────────────────────────────────────────── */
function StatusBadge({ estado }) {
  const s = ESTADO[estado] || ESTADO.pendiente;
  const Icon = s.Icon;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: `${s.color}18`, border: `1px solid ${s.color}44`, color: s.color, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '700' }}>
      <Icon size={12} /> {s.label}
    </div>
  );
}

/* ─── ORDER CARD ─────────────────────────────────────────────── */
function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const estado = ESTADO[order.sEstado] || ESTADO.pendiente;

  return (
    <div style={{ background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ height: '3px', background: estado.color, boxShadow: `0 0 8px ${estado.color}88` }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ color: C.textPrimary, fontWeight: '800', fontSize: '15px' }}>Pedido #{order.id}</div>
            <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '2px' }}>
              {new Date(order.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <StatusBadge estado={order.sEstado} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          {(order.items || []).slice(0, open ? undefined : 3).map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: C.textSecondary, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: C.textMuted, fontWeight: '700', fontSize: '11px', background: C.bgAccent, borderRadius: '4px', padding: '1px 5px' }}>x{item.iCantidad}</span>
                {item.producto?.sNombre || `Producto #${item.iProductoId}`}
              </span>
              <span style={{ color: C.textSecondary, fontSize: '12px', fontWeight: '600' }}>${parseFloat(item.dSubtotal).toFixed(2)}</span>
            </div>
          ))}
          {!open && (order.items?.length || 0) > 3 && (
            <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: C.teal, fontSize: '12px', fontWeight: '700', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: FONT }}>
              +{order.items.length - 3} más...
            </button>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: `1px solid ${C.border}` }}>
          <span style={{ color: C.textMuted, fontSize: '13px' }}>Total</span>
          <span style={{ color: C.yellow, fontWeight: '800', fontSize: '17px' }}>${parseFloat(order.dTotal).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MY ORDERS PAGE
═══════════════════════════════════════════════════════════════ */
const MyOrders = () => {
  const navigate = useNavigate();
  const { user, loginAt, logout } = useAuth();
  const { totalItems } = useCart();
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState('');

  const iMesaId = user?.iMesaId;

  const loadOrders = async () => {
    try {
      const data = await ordersService.getAll({ iMesaId });
      const desde = loginAt ? new Date(loginAt) : null;
      const filtrados = desde
        ? (data.data || []).filter(o => new Date(o.createdAt) >= desde)
        : (data.data || []);
      setOrders(filtrados);
    } catch (e) {
      setError('No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [loginAt, iMesaId]);

  const handleRefresh = () => { setRefreshing(true); loadOrders(); };

  const activos     = orders.filter(o => ['pendiente', 'en_preparacion'].includes(o.sEstado));
  const completados = orders.filter(o => ['listo', 'entregado', 'cancelado'].includes(o.sEstado));

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, color: C.textPrimary }}>
      <ClientHeader user={user} totalItems={totalItems} onLogout={logout} />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ClipboardList size={16} color={C.purple} />
              <span style={{ color: C.textMuted, fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Esta sesión</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 'clamp(20px,4vw,26px)', fontWeight: '800', color: C.textPrimary }}>Mis Pedidos</h1>
            {loginAt && (
              <p style={{ margin: '4px 0 0', color: C.textMuted, fontSize: '12px' }}>
                Desde las {new Date(loginAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleRefresh}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '9px', padding: '8px 14px', color: C.textSecondary, fontFamily: FONT, fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}>
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} /> Actualizar
            </button>
            <button onClick={() => navigate('/menu')}
              style={{ background: C.pink, color: '#fff', border: 'none', borderRadius: '9px', padding: '8px 16px', fontFamily: FONT, fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: glow(C.pink, '44') }}>
              <Plus size={14} /> Nuevo pedido
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: `3px solid ${C.border}`, borderTopColor: C.purple, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: '14px', color: C.textMuted, fontSize: '14px' }}>Cargando pedidos...</p>
          </div>

        ) : error ? (
          <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: '12px', padding: '16px 20px', color: C.pink, fontSize: '13px', fontWeight: '600' }}>{error}</div>

        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${C.purple}12`, border: `1.5px solid ${C.purple}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: glow(C.purple, '22') }}>
              <ClipboardList size={28} color={C.purple} />
            </div>
            <h3 style={{ color: C.textPrimary, margin: '0 0 8px', fontWeight: '800' }}>Sin pedidos aún</h3>
            <p style={{ color: C.textSecondary, fontSize: '14px', margin: '0 0 24px' }}>No has realizado ningún pedido en esta sesión</p>
            <button onClick={() => navigate('/menu')} style={{ background: C.pink, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontFamily: FONT, fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: glow(C.pink) }}>
              <UtensilsCrossed size={16} /> Ver el menú
            </button>
          </div>

        ) : (
          <>
            {activos.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '4px', height: '18px', borderRadius: '2px', background: C.orange, boxShadow: glow(C.orange) }} />
                  <h2 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: C.textPrimary, textTransform: 'uppercase', letterSpacing: '1px' }}>En proceso</h2>
                  <span style={{ background: `${C.orange}18`, border: `1px solid ${C.orange}44`, color: C.orange, borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>{activos.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activos.map(o => <OrderCard key={o.id} order={o} />)}
                </div>
              </div>
            )}

            {completados.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '4px', height: '18px', borderRadius: '2px', background: C.textMuted }} />
                  <h2 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Historial</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {completados.map(o => <OrderCard key={o.id} order={o} />)}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MyOrders;