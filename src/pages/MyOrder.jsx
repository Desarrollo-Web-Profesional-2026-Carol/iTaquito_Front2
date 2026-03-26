import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersService } from '../services/orders';
import { C, FONT, glow } from '../styles/designTokens';
import {
  ShoppingBag, UtensilsCrossed, Trash2, Plus, Minus,
  ChevronRight, CheckCircle, Receipt, AlertCircle,
  Loader, LogOut, MapPin, Utensils, ClipboardList
} from 'lucide-react';

/* ─── PAPEL PICADO ───────────────────────────────────────────── */
const PICADO = [C.pink, C.orange, C.yellow, C.teal, C.purple, C.pinkDim, C.orangeDim, C.tealDim];
function PapelPicado({ flip = false }) {
  const count = 16, w = 100 / count;
  return (
    <div style={{ width: '100%', lineHeight: 0, flexShrink: 0, transform: flip ? 'scaleY(-1)' : 'none' }}>
      <svg viewBox="0 0 100 12" preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '36px' }} xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: count }).map((_, i) => {
          const x = i * w;
          return <polygon key={i} points={`${x},0 ${x + w},0 ${x + w / 2},12`} fill={PICADO[i % PICADO.length]} />;
        })}
      </svg>
    </div>
  );
}

/* ─── NAV BUTTON ─────────────────────────────────────────────── */
function NavBtn({ label, active, color, onClick, children }) {
  const [hov, setHov] = useState(false);
  const c = color || C.teal;
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: active ? `${c}18` : hov ? C.bgCardHov : 'transparent',
        border: `1.5px solid ${active ? c + '55' : hov ? C.border : 'transparent'}`,
        borderRadius: '8px', padding: '6px 12px',
        color: active ? c : hov ? C.textPrimary : C.textSecondary,
        fontFamily: FONT, fontWeight: '700', fontSize: '12px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
        transition: 'all 0.18s', flexShrink: 0,
      }}>
      {children} {label}
    </button>
  );
}

/* ─── CLIENT HEADER ──────────────────────────────────────────── */
function ClientHeader({ totalItems, onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mesaNombre, iMesaId } = useAuth();

  return (
    <header style={{
      background: C.bgAccent, borderBottom: `1px solid ${C.border}`,
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 2px 16px rgba(0,0,0,0.4)', fontFamily: FONT,
    }}>
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${C.teal}, ${C.teal}88, transparent)`, boxShadow: `0 0 10px ${C.teal}66` }} />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px', height: '54px', display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Logo */}
        <div onClick={() => navigate('/menu')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${C.teal}22`, border: `1.5px solid ${C.teal}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glow(C.teal, '33') }}>
            <Utensils size={15} color={C.teal} />
          </div>
          <span style={{ color: C.cream, fontWeight: '800', fontSize: '16px' }}>iTaquito</span>
        </div>

        {/* Badge mesa - AHORA USA EL CONTEXTO DIRECTO */}
        {(mesaNombre || iMesaId) && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            background: `${C.teal}12`, 
            border: `1px solid ${C.teal}33`, 
            borderRadius: '20px', 
            padding: '4px 10px', 
            color: C.teal, 
            fontSize: '12px', 
            fontWeight: '700' 
          }}>
            <MapPin size={11} /> 
            {mesaNombre || `Mesa ${iMesaId}`}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <NavBtn label="Menú"        active={pathname === '/menu'}       color={C.teal}   onClick={() => navigate('/menu')}>
          <UtensilsCrossed size={14} />
        </NavBtn>

        <NavBtn label="Mi Pedido"   active={pathname === '/my-order'}   color={C.pink}   onClick={() => navigate('/my-order')}>
          <ShoppingBag size={14} />
          {totalItems > 0 && (
            <span style={{ background: C.pink, color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {totalItems}
            </span>
          )}
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

/* ─── QTY BUTTON ─────────────────────────────────────────────── */
function QtyBtn({ Icon, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0, background: hov ? `${color}22` : `${color}12`, border: `1.5px solid ${hov ? color : color + '44'}`, color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
      <Icon size={13} />
    </button>
  );
}

/* ─── ITEM CARD ──────────────────────────────────────────────── */
function ItemCard({ item, onIncrement, onDecrement, onRemove }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const handleRemove = () => {
    if (confirmDelete) { onRemove(item.id); }
    else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 2500); }
  };
  return (
    <div style={{ background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, background: `${C.pink}15`, border: `1.5px solid ${C.pink}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {item.imagen ? <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UtensilsCrossed size={20} color={C.pink} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: C.textPrimary, fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.nombre}</div>
        <div style={{ color: C.teal, fontWeight: '700', fontSize: '12px', marginTop: '2px' }}>${parseFloat(item.precio).toFixed(2)} c/u</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <QtyBtn Icon={Minus} color={C.orange} onClick={() => onDecrement(item.id)} />
        <span style={{ color: C.textPrimary, fontWeight: '800', fontSize: '16px', minWidth: '22px', textAlign: 'center', fontFamily: FONT }}>{item.qty}</span>
        <QtyBtn Icon={Plus} color={C.teal} onClick={() => onIncrement(item)} />
      </div>
      <div style={{ color: C.yellow, fontWeight: '800', fontSize: '15px', minWidth: '64px', textAlign: 'right', flexShrink: 0 }}>
        ${(parseFloat(item.precio) * item.qty).toFixed(2)}
      </div>
      <button onClick={handleRemove} title={confirmDelete ? 'Toca de nuevo para confirmar' : 'Eliminar'}
        style={{ background: confirmDelete ? `${C.pink}22` : 'transparent', border: `1.5px solid ${confirmDelete ? C.pink : C.border}`, borderRadius: '8px', padding: '6px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s', color: confirmDelete ? C.pink : C.textMuted }}>
        {confirmDelete ? <AlertCircle size={15} /> : <Trash2 size={15} />}
      </button>
    </div>
  );
}

/* ─── EMPTY STATE ────────────────────────────────────────────── */
function EmptyCart({ onGoMenu }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: `${C.pink}15`, border: `1.5px solid ${C.pink}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: glow(C.pink, '22') }}>
        <ShoppingBag size={30} color={C.pink} />
      </div>
      <h3 style={{ color: C.textPrimary, margin: '0 0 8px', fontFamily: FONT, fontWeight: '800', fontSize: '18px' }}>Tu pedido está vacío</h3>
      <p style={{ color: C.textSecondary, fontSize: '14px', margin: '0 0 28px' }}>Agrega productos desde el menú para comenzar</p>
      <button onClick={onGoMenu} style={{ background: C.pink, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontFamily: FONT, fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: glow(C.pink) }}>
        <UtensilsCrossed size={16} /> Ver productos
      </button>
    </div>
  );
}

/* ─── PANTALLA DE ÉXITO ──────────────────────────────────────── */
function OrderSuccess({ onGoMenu, onViewOrders }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: `${C.teal}08`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: `${C.teal}18`, border: `2px solid ${C.teal}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: glow(C.teal, '44') }}>
        <CheckCircle size={40} color={C.teal} />
      </div>
      <h1 style={{ color: C.textPrimary, fontSize: '26px', fontWeight: '800', margin: '0 0 8px' }}>¡Pedido enviado!</h1>
      <p style={{ color: C.textSecondary, fontSize: '14px', margin: '0 0 4px' }}>Tu orden está en cola de preparación.</p>
      <p style={{ color: C.textMuted, fontSize: '13px', margin: '0 0 32px' }}>
        Tiempo estimado: <strong style={{ color: C.orange }}>~8 min</strong>
      </p>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '32px' }}>
        {[C.pink, C.orange, C.yellow, C.teal, C.purple].map((c, i) => (
          <div key={i} style={{ width: '32px', height: '4px', borderRadius: '2px', background: c, boxShadow: `0 0 6px ${c}88` }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onViewOrders} style={{ background: C.teal, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontFamily: FONT, fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: glow(C.teal) }}>
          <ClipboardList size={16} /> Ver mis pedidos
        </button>
        <button onClick={onGoMenu} style={{ background: 'transparent', color: C.textSecondary, border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '12px 24px', fontFamily: FONT, fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <UtensilsCrossed size={16} /> Seguir en el menú
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MY ORDER PAGE
═══════════════════════════════════════════════════════════════ */
const MyOrder = () => {
  const navigate = useNavigate();
  const { logout, getMesaId, mesaNombre } = useAuth();
  const { items, addItem, decrementItem, removeItem, clearCart, totalItems, totalPrecio } = useCart();
  const [ordering, setOrdering] = useState(false);
  const [ordered,  setOrdered]  = useState(false);
  const [error,    setError]    = useState('');

  // AHORA USA getMesaId() del contexto
  const iMesaId = getMesaId();

  // Debug: puedes ver qué mesa se está usando
  console.log('MyOrder - Mesa actual:', { iMesaId, mesaNombre });

  const handleOrder = async () => {
    if (items.length === 0) return;
    if (!iMesaId) {
      setError('No se ha identificado la mesa. Por favor, cierra sesión y vuelve a iniciar.');
      return;
    }
    
    setOrdering(true);
    setError('');
    try {
      await ordersService.create({
        iMesaId,
        items: items.map(i => ({ iProductoId: i.id, iCantidad: i.qty })),
      });
      clearCart();
      setOrdered(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Error al enviar el pedido. Intenta de nuevo.');
    } finally {
      setOrdering(false);
    }
  };

  if (ordered) return (
    <OrderSuccess
      onGoMenu={() => navigate('/menu')}
      onViewOrders={() => navigate('/my-orders')}
    />
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, color: C.textPrimary }}>
      <ClientHeader totalItems={totalItems} onLogout={logout} />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{ width: '4px', height: '26px', borderRadius: '2px', background: C.pink, boxShadow: glow(C.pink) }} />
          <div>
            <h1 style={{ margin: 0, fontSize: 'clamp(20px,4vw,26px)', fontWeight: '800', color: C.textPrimary, lineHeight: 1.1 }}>Mi Pedido</h1>
            {totalItems > 0 && <p style={{ margin: 0, color: C.textMuted, fontSize: '13px' }}>{totalItems} producto{totalItems !== 1 ? 's' : ''} seleccionado{totalItems !== 1 ? 's' : ''}</p>}
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyCart onGoMenu={() => navigate('/menu')} />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {items.map(item => (
                <ItemCard key={item.id} item={item} onIncrement={addItem} onDecrement={decrementItem} onRemove={removeItem} />
              ))}
            </div>

            <PapelPicado />

            {/* Resumen */}
            <div style={{ background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: '16px', padding: '20px', margin: '24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '4px', height: '18px', borderRadius: '2px', background: C.yellow, boxShadow: glow(C.yellow) }} />
                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: C.textPrimary }}>Resumen</h2>
                <Receipt size={14} color={C.textMuted} style={{ marginLeft: 'auto' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: C.textSecondary, fontSize: '13px' }}>{item.nombre}<span style={{ color: C.textMuted, marginLeft: '6px' }}>x{item.qty}</span></span>
                    <span style={{ color: C.textSecondary, fontSize: '13px', fontWeight: '600' }}>${(parseFloat(item.precio) * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ height: '1px', background: C.border, margin: '14px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: C.textPrimary, fontWeight: '700', fontSize: '15px' }}>Total</span>
                <span style={{ color: C.yellow, fontWeight: '800', fontSize: '22px', textShadow: `0 0 12px ${C.yellow}44` }}>${totalPrecio.toFixed(2)}</span>
              </div>
            </div>

            <PapelPicado flip />

            {error && (
              <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: '10px', padding: '12px 16px', margin: '16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: C.pink, fontSize: '13px', fontWeight: '600' }}>
                <AlertCircle size={15} /> {error}
              </div>
            )}
          </>
        )}
      </main>

      {/* Barra inferior */}
      {items.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.bgAccent, borderTop: `1px solid ${C.border}`, padding: '12px 24px 16px', display: 'flex', gap: '10px', boxShadow: '0 -8px 32px rgba(0,0,0,0.4)', zIndex: 100, fontFamily: FONT }}>
          <button onClick={() => navigate('/menu')}
            style={{ flex: '0 0 auto', background: C.bgCard, color: C.textSecondary, border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '12px 18px', fontFamily: FONT, fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.color = C.pink; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}>
            <UtensilsCrossed size={15} /> Ver productos
          </button>
          <button onClick={handleOrder} disabled={ordering}
            style={{ flex: 1, background: ordering ? C.bgCard : C.teal, color: ordering ? C.textMuted : '#fff', border: `1.5px solid ${ordering ? C.border : C.teal}`, borderRadius: '10px', padding: '12px 20px', fontFamily: FONT, fontWeight: '800', fontSize: '14px', cursor: ordering ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: ordering ? 'none' : glow(C.teal, '55') }}>
            {ordering ? <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Enviando...</> : <><ChevronRight size={16} /> Ordenar — ${totalPrecio.toFixed(2)}</>}
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MyOrder;