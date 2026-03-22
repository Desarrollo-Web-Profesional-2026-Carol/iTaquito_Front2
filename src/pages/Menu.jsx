import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { productsService } from '../services/products';
import { categoriesService } from '../services/categories';
import { C, FONT, glow } from '../styles/designTokens';
import {
  Search, SlidersHorizontal, ShoppingBag, UtensilsCrossed,
  Plus, Check, X, ChevronUp, ChevronDown, AlertCircle,
  LogOut, MapPin, Utensils, LayoutDashboard, TableProperties
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
function NavBtn({ label, active, onClick, color, children }) {
  const [hov, setHov] = useState(false);
  const c = color || C.teal;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: active ? `${c}18` : hov ? C.bgCardHov : 'transparent',
        border: `1.5px solid ${active ? c + '55' : hov ? C.border : 'transparent'}`,
        borderRadius: '8px', padding: '6px 12px',
        color: active ? c : hov ? C.textPrimary : C.textSecondary,
        fontFamily: FONT, fontWeight: '700', fontSize: '12px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
        transition: 'all 0.18s', flexShrink: 0,
      }}
    >
      {children} {label}
    </button>
  );
}

/* ─── HEADER CLIENTE ─────────────────────────────────────────── */
function ClientHeader({ user, totalItems, onLogout }) {
  const navigate = useNavigate();
  return (
    <header style={{
      background: C.bgAccent, borderBottom: `1px solid ${C.border}`,
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 2px 16px rgba(0,0,0,0.4)', fontFamily: FONT,
    }}>
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${C.teal}, ${C.teal}88, transparent)`, boxShadow: `0 0 10px ${C.teal}66` }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', height: '54px', display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Logo */}
        <div onClick={() => navigate('/menu')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${C.teal}22`, border: `1.5px solid ${C.teal}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glow(C.teal, '33') }}>
            <Utensils size={15} color={C.teal} />
          </div>
          <span style={{ color: C.cream, fontWeight: '800', fontSize: '16px' }}>iTaquito</span>
        </div>

        {/* Badge mesa */}
        {(user?.mesa || user?.iMesaId) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `${C.teal}12`, border: `1px solid ${C.teal}33`, borderRadius: '20px', padding: '4px 10px', color: C.teal, fontSize: '12px', fontWeight: '700' }}>
            <MapPin size={11} /> {user.mesa?.sNombre || `Mesa ${user.iMesaId}`}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <NavBtn label="Menú" active={true} color={C.teal} onClick={() => navigate('/menu')}>
          <UtensilsCrossed size={14} />
        </NavBtn>

        <NavBtn label="Mi Pedido" active={false} color={C.pink} onClick={() => navigate('/my-orders')}>
          <ShoppingBag size={14} />
          {totalItems > 0 && (
            <span style={{ background: C.pink, color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '2px' }}>
              {totalItems}
            </span>
          )}
        </NavBtn>

        <button onClick={onLogout} style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}33`, borderRadius: '8px', padding: '6px 12px', color: C.pink, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = `${C.pink}22`; e.currentTarget.style.borderColor = C.pink; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${C.pink}12`; e.currentTarget.style.borderColor = `${C.pink}33`; }}>
          <LogOut size={13} /> Salir
        </button>
      </div>
    </header>
  );
}

/* ─── HEADER ADMIN ───────────────────────────────────────────── */
function AdminHeader({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <header style={{
      background: C.bgAccent, borderBottom: `1px solid ${C.border}`,
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 2px 16px rgba(0,0,0,0.4)', fontFamily: FONT,
    }}>
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${C.pink}, ${C.pink}88, transparent)`, boxShadow: `0 0 10px ${C.pink}66` }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', height: '54px', display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Logo */}
        <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${C.pink}22`, border: `1.5px solid ${C.pink}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glow(C.pink, '33') }}>
            <Utensils size={15} color={C.pink} />
          </div>
          <span style={{ color: C.cream, fontWeight: '800', fontSize: '16px' }}>iTaquito</span>
        </div>

        {/* Badge admin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `${C.pink}12`, border: `1px solid ${C.pink}33`, borderRadius: '20px', padding: '4px 10px', color: C.pink, fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Admin
        </div>

        <div style={{ flex: 1 }} />

        <NavBtn label="Dashboard" active={false} color={C.pink} onClick={() => navigate('/dashboard')}>
          <LayoutDashboard size={14} />
        </NavBtn>

        <NavBtn label="Mesas" active={false} color={C.orange} onClick={() => navigate('/tables')}>
          <TableProperties size={14} />
        </NavBtn>

        <NavBtn label="Menú" active={true} color={C.teal} onClick={() => navigate('/menu')}>
          <UtensilsCrossed size={14} />
        </NavBtn>

        <button onClick={onLogout} style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}33`, borderRadius: '8px', padding: '6px 12px', color: C.pink, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = `${C.pink}22`; e.currentTarget.style.borderColor = C.pink; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${C.pink}12`; e.currentTarget.style.borderColor = `${C.pink}33`; }}>
          <LogOut size={13} /> Salir
        </button>
      </div>
    </header>
  );
}

/* ─── PRODUCT CARD ───────────────────────────────────────────── */
function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);
  const [hov,   setHov]   = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const disponible = product.bDisponible;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:    hov && disponible ? C.bgCardHov : C.bgCard,
        border:        `1.5px solid ${hov && disponible ? C.pink : C.border}`,
        borderRadius:  '16px', overflow: 'hidden',
        display:       'flex', flexDirection: 'column',
        transform:     hov && disponible ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:     hov && disponible ? `0 12px 28px rgba(0,0,0,0.35), ${glow(C.pink, '18')}` : '0 2px 8px rgba(0,0,0,0.2)',
        transition:    'all 0.22s ease',
        opacity:       disponible ? 1 : 0.55,
      }}
    >
      <div style={{ width: '100%', aspectRatio: '16/9', background: `${C.pink}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {product.sImagenUrl
          ? <img src={product.sImagenUrl} alt={product.sNombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <UtensilsCrossed size={32} color={`${C.pink}55`} />
        }
        {product.categoria && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', borderRadius: '20px', padding: '3px 10px', color: C.textSecondary, fontSize: '11px', fontWeight: '700' }}>
            {product.categoria.sNombre}
          </div>
        )}
        {!disponible && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,13,11,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: C.bgAccent, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: '700' }}>
              No disponible
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 14px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 style={{ margin: 0, color: C.textPrimary, fontWeight: '800', fontSize: '15px', lineHeight: 1.3, fontFamily: FONT }}>
          {product.sNombre}
        </h3>
        {product.sDescripcion && (
          <p style={{ margin: 0, color: C.textMuted, fontSize: '12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.sDescripcion}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: `1px solid ${C.border}` }}>
          <span style={{ color: C.yellow, fontWeight: '800', fontSize: '18px', textShadow: `0 0 10px ${C.yellow}33` }}>
            ${parseFloat(product.dPrecio).toFixed(2)}
          </span>
          <button onClick={handleAdd} disabled={!disponible} style={{
            background:    added ? C.teal : disponible ? C.pink : C.bgAccent,
            color:         disponible ? '#fff' : C.textMuted,
            border:        'none', borderRadius: '9px', padding: '7px 14px',
            fontFamily:    FONT, fontWeight: '700', fontSize: '12px',
            cursor:        disponible ? 'pointer' : 'not-allowed',
            display:       'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s',
            boxShadow:     added ? glow(C.teal, '55') : disponible ? glow(C.pink, '44') : 'none',
            minWidth:      '90px', justifyContent: 'center',
          }}>
            {added ? <><Check size={13} /> Agregado</> : <><Plus size={13} /> Agregar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── CART FAB ───────────────────────────────────────────────── */
function CartFab({ totalItems, totalPrecio, onClick }) {
  if (totalItems === 0) return null;
  return (
    <button onClick={onClick} style={{
      position: 'fixed', bottom: '24px', right: '24px',
      background: C.pink, color: '#fff', border: 'none',
      borderRadius: '14px', padding: '12px 20px',
      fontFamily: FONT, fontWeight: '800', fontSize: '14px',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
      boxShadow: `0 8px 24px rgba(0,0,0,0.4), ${glow(C.pink, '66')}`,
      zIndex: 150, transition: 'transform 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <ShoppingBag size={18} />
      <span>{totalItems} producto{totalItems !== 1 ? 's' : ''}</span>
      <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.3)' }} />
      <span>${totalPrecio.toFixed(2)}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MENU PAGE
═══════════════════════════════════════════════════════════════ */
const Menu = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { addItem, totalItems, totalPrecio } = useCart();

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [catId,       setCatId]       = useState('');
  const [soloDisp,    setSoloDisp]    = useState(false);
  const [orden,       setOrden]       = useState('');
  const [searchFocus, setSearchFocus] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          productsService.getAll(),
          categoriesService.getAll(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (e) {
        setError('No se pudo cargar el menú. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) list = list.filter(p => p.sNombre.toLowerCase().includes(search.toLowerCase()));
    if (catId) list = list.filter(p => String(p.iCategoriaId) === String(catId));
    if (soloDisp) list = list.filter(p => p.bDisponible);
    if (orden === 'asc')  list.sort((a, b) => parseFloat(a.dPrecio) - parseFloat(b.dPrecio));
    if (orden === 'desc') list.sort((a, b) => parseFloat(b.dPrecio) - parseFloat(a.dPrecio));
    return list;
  }, [products, search, catId, soloDisp, orden]);

  const handleAdd = (product) => {
    addItem({ id: product.id, nombre: product.sNombre, precio: parseFloat(product.dPrecio), imagen: product.sImagenUrl || null });
  };

  const clearFilters = () => { setSearch(''); setCatId(''); setSoloDisp(false); setOrden(''); };
  const hasFilters = search || catId || soloDisp || orden;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, color: C.textPrimary }}>

      {/* Header según rol */}
      {isAdmin
        ? <AdminHeader user={user} onLogout={logout} />
        : <ClientHeader user={user} totalItems={totalItems} onLogout={logout} />
      }

      <PapelPicado />

      {/* Hero */}
      <div style={{ background: C.bg, padding: '28px 24px 24px', textAlign: 'center', borderBottom: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '10%', width: '260px', height: '260px', borderRadius: '50%', background: `${C.pink}08`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-60px', right: '10%', width: '220px', height: '220px', borderRadius: '50%', background: `${C.teal}08`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(24px,5vw,38px)', fontWeight: '800', color: C.pink, letterSpacing: '-0.5px' }}>
            Nuestro Menú
          </h1>
          <p style={{ margin: 0, color: C.textSecondary, fontSize: '14px' }}>
            {loading ? 'Cargando...' : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <PapelPicado flip />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 120px' }}>

        {/* Filtros */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '16px 18px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <SlidersHorizontal size={15} color={C.textMuted} style={{ flexShrink: 0 }} />

          <div style={{ position: 'relative', flex: '1 1 200px', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color={searchFocus ? C.pink : C.textMuted} style={{ position: 'absolute', left: '10px', pointerEvents: 'none', transition: 'color 0.18s' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
              placeholder="Buscar producto..."
              style={{ width: '100%', boxSizing: 'border-box', background: C.bg, border: `1.5px solid ${searchFocus ? C.pink : C.border}`, borderRadius: '9px', padding: '8px 32px 8px 30px', color: C.textPrimary, fontFamily: FONT, fontWeight: '600', fontSize: '13px', outline: 'none', transition: 'border-color 0.18s' }} />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex', padding: '2px' }}>
                <X size={13} />
              </button>
            )}
          </div>

          <select value={catId} onChange={e => setCatId(e.target.value)} style={{ background: C.bg, border: `1.5px solid ${catId ? C.pink : C.border}`, borderRadius: '9px', padding: '8px 32px 8px 12px', color: catId ? C.textPrimary : C.textMuted, fontFamily: FONT, fontWeight: '600', fontSize: '13px', outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C5040' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'calc(100% - 10px) center', minWidth: '150px', flexShrink: 0 }}>
            <option value="">Todas las categorías</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.sNombre}</option>)}
          </select>

          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            {[{ val: 'asc', Icon: ChevronUp, label: 'Menor precio' }, { val: 'desc', Icon: ChevronDown, label: 'Mayor precio' }].map(({ val, Icon, label }) => (
              <button key={val} onClick={() => setOrden(o => o === val ? '' : val)} title={label}
                style={{ background: orden === val ? `${C.teal}22` : 'transparent', border: `1.5px solid ${orden === val ? C.teal : C.border}`, borderRadius: '9px', padding: '7px 10px', color: orden === val ? C.teal : C.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: FONT, fontWeight: '700', fontSize: '12px', transition: 'all 0.18s' }}>
                <Icon size={13} /> Precio
              </button>
            ))}
          </div>

          <button onClick={() => setSoloDisp(s => !s)} style={{ background: soloDisp ? `${C.teal}18` : 'transparent', border: `1.5px solid ${soloDisp ? C.teal : C.border}`, borderRadius: '9px', padding: '7px 12px', color: soloDisp ? C.teal : C.textMuted, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.18s', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Check size={12} /> Solo disponibles
          </button>

          {hasFilters && (
            <button onClick={clearFilters} style={{ background: `${C.pink}12`, border: `1.5px solid ${C.pink}44`, borderRadius: '9px', padding: '7px 12px', color: C.pink, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = `${C.pink}22`; e.currentTarget.style.borderColor = C.pink; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${C.pink}12`; e.currentTarget.style.borderColor = `${C.pink}44`; }}>
              <X size={12} /> Limpiar
            </button>
          )}
        </div>

        {/* Contenido */}
        {error ? (
          <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '10px', color: C.pink, fontSize: '14px', fontWeight: '600' }}>
            <AlertCircle size={18} /> {error}
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ display: 'inline-block', width: '44px', height: '44px', border: `3px solid ${C.border}`, borderTopColor: C.pink, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: '16px', color: C.textMuted, fontSize: '14px' }}>Cargando menú...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${C.pink}12`, border: `1.5px solid ${C.pink}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <UtensilsCrossed size={28} color={C.pink} />
            </div>
            <h3 style={{ color: C.textPrimary, margin: '0 0 8px', fontWeight: '800' }}>Sin resultados</h3>
            <p style={{ color: C.textSecondary, fontSize: '14px', margin: '0 0 20px' }}>Prueba con otros filtros</p>
            <button onClick={clearFilters} style={{ background: C.pink, color: '#fff', border: 'none', borderRadius: '9px', padding: '10px 22px', fontFamily: FONT, fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: glow(C.pink) }}>
              Ver todo el menú
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filtered.map(product => <ProductCard key={product.id} product={product} onAdd={handleAdd} />)}
          </div>
        )}
      </main>

      {/* FAB solo para clientes */}
      {!isAdmin && (
        <CartFab totalItems={totalItems} totalPrecio={totalPrecio} onClick={() => navigate('/my-order')} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Menu;