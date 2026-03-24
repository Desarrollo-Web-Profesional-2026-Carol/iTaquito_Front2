import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productsService } from '../services/products';
import { categoriesService } from '../services/categories';
import { C, FONT, glow } from '../styles/designTokens';
import {
  Search, SlidersHorizontal, UtensilsCrossed,
  Plus, Check, X, ChevronUp, ChevronDown, AlertCircle,
  LogOut, Utensils, LayoutDashboard, TableProperties,
  Pencil, Trash2, Eye, EyeOff, Save, ImagePlus,
  DollarSign, ToggleLeft, ToggleRight, Users, Package
} from 'lucide-react';

/* ─── NAV BUTTON ─────────────────────────────────────────────── */
function NavBtn({ label, active, onClick, color, children }) {
  const [hov, setHov] = useState(false);
  const c = color || C.teal;
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: active ? `${c}18` : hov ? C.bgCardHov : 'transparent', border: `1.5px solid ${active ? c + '55' : hov ? C.border : 'transparent'}`, borderRadius: '8px', padding: '6px 12px', color: active ? c : hov ? C.textPrimary : C.textSecondary, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s', flexShrink: 0 }}>
      {children} {label}
    </button>
  );
}

/* ─── HEADER ADMIN ───────────────────────────────────────────── */
function AdminHeader({ onLogout }) {
  const navigate = useNavigate();
  const path = window.location.pathname;
  return (
    <header style={{ background: C.bgAccent, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 2px 16px rgba(0,0,0,0.4)', fontFamily: FONT }}>
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${C.pink}, ${C.pink}88, transparent)`, boxShadow: `0 0 10px ${C.pink}66` }} />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', height: '54px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${C.pink}22`, border: `1.5px solid ${C.pink}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glow(C.pink, '33') }}>
            <Utensils size={15} color={C.pink} />
          </div>
          <span style={{ color: C.cream, fontWeight: '800', fontSize: '16px' }}>iTaquito</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `${C.pink}12`, border: `1px solid ${C.pink}33`, borderRadius: '20px', padding: '4px 10px', color: C.pink, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin</div>
        <div style={{ flex: 1 }} />
        <NavBtn label="Dashboard" active={path === '/dashboard'} color={C.pink}   onClick={() => navigate('/dashboard')}><LayoutDashboard size={14} /></NavBtn>
        <NavBtn label="Mesas"     active={path === '/tables'}    color={C.orange}  onClick={() => navigate('/tables')}><TableProperties size={14} /></NavBtn>
        <NavBtn label="Menú"      active={path === '/menu'}      color={C.teal}    onClick={() => navigate('/menu')}><UtensilsCrossed size={14} /></NavBtn>
        <NavBtn label="Usuarios"  active={path === '/users'}     color={C.purple}  onClick={() => navigate('/users')}><Users size={14} /></NavBtn>
        <button onClick={onLogout}
          style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}33`, borderRadius: '8px', padding: '6px 12px', color: C.pink, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          onMouseEnter={e => { e.currentTarget.style.background = `${C.pink}22`; e.currentTarget.style.borderColor = C.pink; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${C.pink}12`; e.currentTarget.style.borderColor = `${C.pink}33`; }}>
          <LogOut size={13} /> Salir
        </button>
      </div>
    </header>
  );
}

/* ─── ADMIN PRODUCT CARD ─────────────────────────────────────── */
function AdminProductCard({ product, onEdit, onDelete, onToggleDisponible }) {
  const [hov, setHov] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) onDelete(product.id);
    else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 2500); }
  };

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.bgCardHov : C.bgCard, border: `1.5px solid ${hov ? C.pink : C.border}`, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.22s ease', transform: hov ? 'translateY(-3px)' : 'translateY(0)', boxShadow: hov ? '0 12px 28px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)', opacity: product.bActivo ? 1 : 0.5 }}>

      {/* Imagen */}
      <div style={{ width: '100%', aspectRatio: '16/9', background: `${C.pink}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {product.sImagenUrl
          ? <img src={product.sImagenUrl} alt={product.sNombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <UtensilsCrossed size={32} color={`${C.pink}55`} />}

        {/* Badge categoría */}
        {product.categoria && (
          <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', borderRadius: '20px', padding: '3px 8px', color: C.textSecondary, fontSize: '10px', fontWeight: '700' }}>
            {product.categoria.sNombre}
          </div>
        )}

        {/* Badge disponibilidad */}
        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <span style={{ background: product.bDisponible ? `${C.teal}dd` : `${C.pink}dd`, borderRadius: '20px', padding: '3px 8px', color: '#fff', fontSize: '10px', fontWeight: '700' }}>
            {product.bDisponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>

        {/* Overlay inactivo */}
        {!product.bActivo && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,13,11,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: C.bgAccent, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: '700' }}>Inactivo</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px', color: C.textPrimary, fontWeight: '800', fontSize: '15px', lineHeight: 1.3 }}>{product.sNombre}</h3>
          {product.sDescripcion && (
            <p style={{ margin: 0, color: C.textMuted, fontSize: '12px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.sDescripcion}</p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: `1px solid ${C.border}` }}>
          <span style={{ color: C.yellow, fontWeight: '800', fontSize: '18px' }}>${parseFloat(product.dPrecio).toFixed(2)}</span>
          <span style={{ color: C.textMuted, fontSize: '11px' }}>ID #{product.id}</span>
        </div>

        {/* Botones acción */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => onEdit(product)}
            style={{ flex: 1, background: `${C.teal}15`, border: `1px solid ${C.teal}44`, borderRadius: '8px', padding: '8px', color: C.teal, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontFamily: FONT, fontWeight: '700', fontSize: '12px', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${C.teal}28`; e.currentTarget.style.borderColor = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${C.teal}15`; e.currentTarget.style.borderColor = `${C.teal}44`; }}>
            <Pencil size={12} /> Editar
          </button>

          <button onClick={() => onToggleDisponible(product)}
            style={{ flex: 1, background: product.bDisponible ? `${C.orange}15` : `${C.teal}15`, border: `1px solid ${product.bDisponible ? C.orange : C.teal}44`, borderRadius: '8px', padding: '8px', color: product.bDisponible ? C.orange : C.teal, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontFamily: FONT, fontWeight: '700', fontSize: '12px', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {product.bDisponible ? <EyeOff size={12} /> : <Eye size={12} />}
            {product.bDisponible ? 'Ocultar' : 'Mostrar'}
          </button>

          <button onClick={handleDelete}
            style={{ background: confirmDelete ? `${C.pink}28` : `${C.pink}15`, border: `1px solid ${confirmDelete ? C.pink : C.pink + '44'}`, borderRadius: '8px', padding: '8px 12px', color: C.pink, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
            title={confirmDelete ? 'Confirmar' : 'Eliminar'}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL PRODUCTO ─────────────────────────────────────────── */
function ProductModal({ product, categories, onSave, onClose }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState({
    sNombre:      product?.sNombre      || '',
    sDescripcion: product?.sDescripcion || '',
    dPrecio:      product?.dPrecio      || '',
    sImagenUrl:   product?.sImagenUrl   || '',
    iCategoriaId: product?.iCategoriaId || '',
    bDisponible:  product?.bDisponible  ?? true,
    bActivo:      product?.bActivo      ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.sNombre.trim())                           return setError('El nombre es requerido.');
    if (!form.dPrecio || isNaN(parseFloat(form.dPrecio))) return setError('El precio debe ser un número válido.');
    if (!form.iCategoriaId)                             return setError('La categoría es requerida.');
    setSaving(true); setError('');
    try {
      await onSave({ ...form, dPrecio: parseFloat(form.dPrecio) }, product?.id);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: '100%', boxSizing: 'border-box', background: C.bg,
    border: `1.5px solid ${C.border}`, borderRadius: '9px',
    padding: '10px 12px', color: C.textPrimary,
    fontFamily: FONT, fontWeight: '600', fontSize: '13px',
    outline: 'none', transition: 'border-color 0.18s',
  };
  const lbl = { color: C.textSecondary, fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.bgAccent, border: `1.5px solid ${C.border}`, borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>

        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: C.pink, boxShadow: glow(C.pink) }} />
            <h2 style={{ margin: 0, color: C.textPrimary, fontFamily: FONT, fontWeight: '800', fontSize: '17px' }}>
              {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', padding: '4px' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Preview imagen */}
          {form.sImagenUrl && (
            <div style={{ width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <img src={form.sImagenUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            </div>
          )}

          <div>
            <label style={lbl}>Nombre *</label>
            <input value={form.sNombre} onChange={e => set('sNombre', e.target.value)} placeholder="Ej: Taco al Pastor" style={inp}
              onFocus={e => e.target.style.borderColor = C.pink} onBlur={e => e.target.style.borderColor = C.border} />
          </div>

          <div>
            <label style={lbl}>Descripción</label>
            <textarea value={form.sDescripcion} onChange={e => set('sDescripcion', e.target.value)} placeholder="Descripción del producto..." rows={3}
              style={{ ...inp, resize: 'vertical', minHeight: '80px' }}
              onFocus={e => e.target.style.borderColor = C.pink} onBlur={e => e.target.style.borderColor = C.border} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Precio *</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={13} color={C.textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="number" step="0.01" min="0" value={form.dPrecio} onChange={e => set('dPrecio', e.target.value)} placeholder="0.00"
                  style={{ ...inp, paddingLeft: '28px' }}
                  onFocus={e => e.target.style.borderColor = C.pink} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
            </div>
            <div>
              <label style={lbl}>Categoría *</label>
              <select value={form.iCategoriaId} onChange={e => set('iCategoriaId', e.target.value)}
                style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = C.pink} onBlur={e => e.target.style.borderColor = C.border}>
                <option value="">Seleccionar...</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.sNombre}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={lbl}>URL de Imagen</label>
            <div style={{ position: 'relative' }}>
              <ImagePlus size={13} color={C.textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={form.sImagenUrl} onChange={e => set('sImagenUrl', e.target.value)} placeholder="https://..."
                style={{ ...inp, paddingLeft: '28px' }}
                onFocus={e => e.target.style.borderColor = C.pink} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { key: 'bDisponible', label: 'Disponible',      color: C.teal   },
              { key: 'bActivo',     label: 'Producto activo', color: C.orange },
            ].map(({ key, label, color }) => (
              <button key={key} onClick={() => set(key, !form[key])}
                style={{ flex: 1, background: form[key] ? `${color}15` : C.bg, border: `1.5px solid ${form[key] ? color + '66' : C.border}`, borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.18s' }}>
                {form[key] ? <ToggleRight size={18} color={color} /> : <ToggleLeft size={18} color={C.textMuted} />}
                <span style={{ color: form[key] ? color : C.textMuted, fontFamily: FONT, fontWeight: '700', fontSize: '12px' }}>{label}</span>
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: '9px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', color: C.pink, fontSize: '13px', fontWeight: '600' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose}
              style={{ flex: 1, background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '12px', color: C.textSecondary, fontFamily: FONT, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ flex: 2, background: saving ? C.bgCard : C.pink, border: `1.5px solid ${saving ? C.border : C.pink}`, borderRadius: '10px', padding: '12px', color: saving ? C.textMuted : '#fff', fontFamily: FONT, fontWeight: '800', fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: saving ? 'none' : glow(C.pink, '44'), transition: 'all 0.2s' }}>
              <Save size={14} /> {saving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MENU ADMIN
═══════════════════════════════════════════════════════════════ */
const MenuAdmin = () => {
  const { logout } = useAuth();

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [catId,       setCatId]       = useState('');
  const [soloDisp,    setSoloDisp]    = useState(false);
  const [soloInact,   setSoloInact]   = useState(false);
  const [orden,       setOrden]       = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [modal,       setModal]       = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        productsService.getAll(),
        categoriesService.getAll(),
      ]);
      setProducts(prods); // Admin ve TODOS (activos e inactivos)
      setCategories(cats);
    } catch {
      setError('No se pudo cargar el menú.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) list = list.filter(p => p.sNombre.toLowerCase().includes(search.toLowerCase()));
    if (catId)       list = list.filter(p => String(p.iCategoriaId) === String(catId));
    if (soloDisp)    list = list.filter(p => p.bDisponible);
    if (soloInact)   list = list.filter(p => !p.bActivo);
    if (orden === 'asc')  list.sort((a, b) => parseFloat(a.dPrecio) - parseFloat(b.dPrecio));
    if (orden === 'desc') list.sort((a, b) => parseFloat(b.dPrecio) - parseFloat(a.dPrecio));
    return list;
  }, [products, search, catId, soloDisp, soloInact, orden]);

  const handleSave = async (data, id) => {
    if (id) await productsService.update(id, data);
    else    await productsService.create(data);
    await load();
  };

  const handleDelete = async (id) => {
    try { await productsService.delete(id); await load(); }
    catch (e) { alert(e.response?.data?.message || 'Error al eliminar.'); }
  };

  const handleToggleDisponible = async (product) => {
    try { await productsService.update(product.id, { bDisponible: !product.bDisponible }); await load(); }
    catch { alert('Error al actualizar disponibilidad.'); }
  };

  const clearFilters = () => { setSearch(''); setCatId(''); setSoloDisp(false); setSoloInact(false); setOrden(''); };
  const hasFilters = search || catId || soloDisp || soloInact || orden;

  const activos   = products.filter(p => p.bActivo).length;
  const inactivos = products.filter(p => !p.bActivo).length;
  const noDisp    = products.filter(p => !p.bDisponible).length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, color: C.textPrimary }}>
      <AdminHeader onLogout={logout} />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* Título + botón crear */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <UtensilsCrossed size={16} color={C.pink} />
              <span style={{ color: C.textMuted, fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Gestión del Menú</span>
            </div>
            <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(20px,4vw,28px)', fontWeight: '800', color: C.textPrimary }}>Productos</h1>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ color: C.teal,     fontSize: '13px', fontWeight: '700' }}>{activos} activos</span>
              <span style={{ color: C.textMuted, fontSize: '13px' }}>{inactivos} inactivos</span>
              <span style={{ color: C.orange,   fontSize: '13px' }}>{noDisp} no disponibles</span>
            </div>
          </div>
          <button onClick={() => setModal('create')}
            style={{ background: C.pink, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontFamily: FONT, fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: glow(C.pink, '55'), transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>

        {/* Filtros */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '16px 18px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <SlidersHorizontal size={15} color={C.textMuted} style={{ flexShrink: 0 }} />

          <div style={{ position: 'relative', flex: '1 1 200px', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color={searchFocus ? C.pink : C.textMuted} style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
              placeholder="Buscar producto..."
              style={{ width: '100%', boxSizing: 'border-box', background: C.bg, border: `1.5px solid ${searchFocus ? C.pink : C.border}`, borderRadius: '9px', padding: '8px 32px 8px 30px', color: C.textPrimary, fontFamily: FONT, fontWeight: '600', fontSize: '13px', outline: 'none', transition: 'border-color 0.18s' }} />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted }}><X size={13} /></button>}
          </div>

          <select value={catId} onChange={e => setCatId(e.target.value)}
            style={{ background: C.bg, border: `1.5px solid ${catId ? C.pink : C.border}`, borderRadius: '9px', padding: '8px 32px 8px 12px', color: catId ? C.textPrimary : C.textMuted, fontFamily: FONT, fontWeight: '600', fontSize: '13px', outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C5040' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'calc(100% - 10px) center', minWidth: '150px' }}>
            <option value="">Todas las categorías</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.sNombre}</option>)}
          </select>

          <div style={{ display: 'flex', gap: '4px' }}>
            {[{ val: 'asc', Icon: ChevronUp, label: 'Menor precio' }, { val: 'desc', Icon: ChevronDown, label: 'Mayor precio' }].map(({ val, Icon, label }) => (
              <button key={val} onClick={() => setOrden(o => o === val ? '' : val)} title={label}
                style={{ background: orden === val ? `${C.teal}22` : 'transparent', border: `1.5px solid ${orden === val ? C.teal : C.border}`, borderRadius: '9px', padding: '7px 10px', color: orden === val ? C.teal : C.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: FONT, fontWeight: '700', fontSize: '12px', transition: 'all 0.18s' }}>
                <Icon size={13} /> Precio
              </button>
            ))}
          </div>

          {/* Filtros extra para admin */}
          <button onClick={() => setSoloDisp(s => !s)}
            style={{ background: soloDisp ? `${C.teal}18` : 'transparent', border: `1.5px solid ${soloDisp ? C.teal : C.border}`, borderRadius: '9px', padding: '7px 12px', color: soloDisp ? C.teal : C.textMuted, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Eye size={12} /> Solo disponibles
          </button>

          <button onClick={() => setSoloInact(s => !s)}
            style={{ background: soloInact ? `${C.orange}18` : 'transparent', border: `1.5px solid ${soloInact ? C.orange : C.border}`, borderRadius: '9px', padding: '7px 12px', color: soloInact ? C.orange : C.textMuted, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <EyeOff size={12} /> Solo inactivos
          </button>

          {hasFilters && (
            <button onClick={clearFilters}
              style={{ background: `${C.pink}12`, border: `1.5px solid ${C.pink}44`, borderRadius: '9px', padding: '7px 12px', color: C.pink, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              onMouseEnter={e => e.currentTarget.style.background = `${C.pink}22`}
              onMouseLeave={e => e.currentTarget.style.background = `${C.pink}12`}>
              <X size={12} /> Limpiar
            </button>
          )}
        </div>

        {/* Grid */}
        {error ? (
          <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '10px', color: C.pink, fontSize: '14px', fontWeight: '600' }}>
            <AlertCircle size={18} /> {error}
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ display: 'inline-block', width: '44px', height: '44px', border: `3px solid ${C.border}`, borderTopColor: C.pink, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: '16px', color: C.textMuted, fontSize: '14px' }}>Cargando productos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${C.pink}12`, border: `1.5px solid ${C.pink}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <UtensilsCrossed size={28} color={C.pink} />
            </div>
            <h3 style={{ color: C.textPrimary, margin: '0 0 8px', fontWeight: '800' }}>Sin resultados</h3>
            <button onClick={clearFilters} style={{ background: C.pink, color: '#fff', border: 'none', borderRadius: '9px', padding: '10px 22px', fontFamily: FONT, fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: glow(C.pink) }}>
              Ver todos
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filtered.map(p => (
              <AdminProductCard key={p.id} product={p}
                onEdit={p => setModal(p)}
                onDelete={handleDelete}
                onToggleDisponible={handleToggleDisponible} />
            ))}
          </div>
        )}
      </main>

      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MenuAdmin;