import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/user';
import { C, FONT, glow } from '../styles/designTokens';
import {
  Users, UserPlus, Pencil, Trash2, Search, X,
  AlertCircle, Save, Eye, EyeOff,
  ShieldCheck, Coffee, CreditCard, User,
  MapPin, Filter, KeyRound, Mail, BadgeCheck,
  RefreshCw
} from 'lucide-react';

/* ─── ROL CONFIG ─────────────────────────────────────────────── */
const ROLES = {
  admin:   { label: 'Admin',   color: C.pink,   Icon: ShieldCheck },
  mesero:  { label: 'Mesero',  color: C.orange,  Icon: Coffee      },
  caja:    { label: 'Caja',    color: C.yellow,  Icon: CreditCard  },
  cliente: { label: 'Cliente', color: C.purple,  Icon: User        },
};

/* ─── ROL BADGE ──────────────────────────────────────────────── */
function RolBadge({ rol }) {
  const cfg = ROLES[rol] || { label: rol, color: C.textMuted, Icon: User };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: `${cfg.color}18`, border: `1px solid ${cfg.color}44`, borderRadius: '20px', padding: '3px 10px', color: cfg.color, fontSize: '11px', fontWeight: '700' }}>
      <cfg.Icon size={11} /> {cfg.label}
    </span>
  );
}

/* ─── USER CARD ──────────────────────────────────────────────── */
function UserCard({ user, onEdit, onDelete, currentUserId }) {
  const [hov, setHov] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isSelf = user.id === currentUserId;
  const cfg = ROLES[user.rol] || ROLES.cliente;

  const handleDelete = () => {
    if (confirmDelete) onDelete(user.id);
    else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 2500); }
  };

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.bgCardHov : C.bgCard, border: `1.5px solid ${hov ? cfg.color : C.border}`, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.22s ease', transform: hov ? 'translateY(-3px)' : 'translateY(0)', boxShadow: hov ? `0 12px 28px rgba(0,0,0,0.3), ${glow(cfg.color, '15')}` : '0 2px 8px rgba(0,0,0,0.2)' }}>

      <div style={{ height: '4px', background: cfg.color, boxShadow: `0 0 8px ${cfg.color}88` }} />

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${cfg.color}18`, border: `1.5px solid ${cfg.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <cfg.Icon size={20} color={cfg.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: C.textPrimary, fontWeight: '800', fontSize: '14px', fontFamily: FONT }}>{user.nombre}</h3>
              {isSelf && (
                <span style={{ background: `${C.teal}18`, border: `1px solid ${C.teal}44`, borderRadius: '20px', padding: '1px 7px', color: C.teal, fontSize: '10px', fontWeight: '700' }}>Tú</span>
              )}
            </div>
            <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
          </div>
          <RolBadge rol={user.rol} />
        </div>

        {user.rol === 'cliente' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: user.mesa ? `${C.teal}10` : `${C.pink}10`, border: `1px solid ${user.mesa ? C.teal : C.pink}33`, borderRadius: '9px', padding: '8px 10px', marginBottom: '12px' }}>
            <MapPin size={12} color={user.mesa ? C.teal : C.pink} />
            <span style={{ color: user.mesa ? C.teal : C.pink, fontSize: '12px', fontWeight: '700' }}>
              {user.mesa ? `${user.mesa.sNombre} · ${user.mesa.sUbicacion}` : 'Sin mesa asignada'}
            </span>
          </div>
        )}

        <div style={{ color: C.textMuted, fontSize: '11px', marginBottom: '12px' }}>
          ID #{user.id} · {new Date(user.createdAt).toLocaleDateString('es-MX')}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => onEdit(user)}
            style={{ flex: 1, background: `${C.teal}15`, border: `1px solid ${C.teal}44`, borderRadius: '8px', padding: '8px', color: C.teal, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontFamily: FONT, fontWeight: '700', fontSize: '12px', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${C.teal}28`; e.currentTarget.style.borderColor = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${C.teal}15`; e.currentTarget.style.borderColor = `${C.teal}44`; }}>
            <Pencil size={12} /> Editar
          </button>
          <button onClick={handleDelete} disabled={isSelf}
            title={isSelf ? 'No puedes eliminar tu propia cuenta' : confirmDelete ? 'Confirmar eliminación' : 'Eliminar'}
            style={{ background: confirmDelete ? `${C.pink}28` : `${C.pink}15`, border: `1px solid ${confirmDelete ? C.pink : C.pink + '44'}`, borderRadius: '8px', padding: '8px 12px', color: isSelf ? C.textMuted : C.pink, cursor: isSelf ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isSelf ? 0.4 : 1, transition: 'all 0.15s' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL USUARIO ──────────────────────────────────────────── */
function UserModal({ user, mesasDisponibles, onSave, onClose }) {
  const isEdit = !!user?.id;
  const [form, setForm] = useState({
    nombre:   user?.nombre  || '',
    email:    user?.email   || '',
    password: '',
    rol:      user?.rol     || 'cliente',
    iMesaId:  user?.iMesaId || '',
  });
  const [showPass, setShowPass] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRolChange = (val) => {
    setForm(f => ({ ...f, rol: val, iMesaId: val === 'cliente' ? f.iMesaId : '' }));
  };

  const handleSave = async () => {
    if (!form.nombre.trim())                      return setError('El nombre es requerido.');
    if (!form.email.trim())                       return setError('El email es requerido.');
    if (!isEdit && !form.password.trim())         return setError('La contraseña es requerida.');
    if (form.rol === 'cliente' && !form.iMesaId)  return setError('Debes asignar una mesa al cliente.');

    setSaving(true); setError('');
    try {
      const payload = {
        nombre:  form.nombre,
        email:   form.email,
        rol:     form.rol,
        iMesaId: form.rol === 'cliente' ? parseInt(form.iMesaId) : null,
      };
      if (form.password.trim()) payload.password = form.password;
      await onSave(payload, user?.id);
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

  const mesasParaSelect = useMemo(() => {
    if (!isEdit) return mesasDisponibles;
    if (user?.mesa && !mesasDisponibles.find(m => m.id === user.iMesaId)) {
      return [user.mesa, ...mesasDisponibles];
    }
    return mesasDisponibles;
  }, [mesasDisponibles, user, isEdit]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.bgAccent, border: `1.5px solid ${C.border}`, borderRadius: '20px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>

        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: C.purple, boxShadow: glow(C.purple) }} />
            <h2 style={{ margin: 0, color: C.textPrimary, fontFamily: FONT, fontWeight: '800', fontSize: '17px' }}>
              {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', padding: '4px' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <div>
            <label style={lbl}>Nombre *</label>
            <div style={{ position: 'relative' }}>
              <User size={13} color={C.textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Nombre completo"
                style={{ ...inp, paddingLeft: '28px' }}
                onFocus={e => e.target.style.borderColor = C.purple} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          </div>

          <div>
            <label style={lbl}>Email *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={13} color={C.textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="correo@ejemplo.com"
                style={{ ...inp, paddingLeft: '28px' }}
                onFocus={e => e.target.style.borderColor = C.purple} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          </div>

          <div>
            <label style={lbl}>{isEdit ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={13} color={C.textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                placeholder={isEdit ? 'Nueva contraseña...' : 'Contraseña...'}
                style={{ ...inp, paddingLeft: '28px', paddingRight: '36px' }}
                onFocus={e => e.target.style.borderColor = C.purple} onBlur={e => e.target.style.borderColor = C.border} />
              <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex' }}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label style={lbl}>Rol *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {Object.entries(ROLES).map(([key, cfg]) => (
                <button key={key} onClick={() => handleRolChange(key)}
                  style={{ background: form.rol === key ? `${cfg.color}20` : C.bg, border: `1.5px solid ${form.rol === key ? cfg.color : C.border}`, borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s' }}>
                  <cfg.Icon size={15} color={form.rol === key ? cfg.color : C.textMuted} />
                  <span style={{ color: form.rol === key ? cfg.color : C.textMuted, fontFamily: FONT, fontWeight: '700', fontSize: '12px' }}>{cfg.label}</span>
                  {form.rol === key && <BadgeCheck size={13} color={cfg.color} style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          </div>

          {form.rol === 'cliente' && (
            <div>
              <label style={lbl}>Mesa asignada *</label>
              {mesasParaSelect.length === 0 ? (
                <div style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}44`, borderRadius: '9px', padding: '10px 14px', color: C.orange, fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={14} /> No hay mesas disponibles.
                </div>
              ) : (
                <select value={form.iMesaId} onChange={e => set('iMesaId', e.target.value)}
                  style={{ ...inp, appearance: 'none', cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C5040' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'calc(100% - 10px) center', paddingRight: '32px' }}
                  onFocus={e => e.target.style.borderColor = C.purple} onBlur={e => e.target.style.borderColor = C.border}>
                  <option value="">Seleccionar mesa...</option>
                  {mesasParaSelect.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.sNombre} · {m.sUbicacion} ({m.iCapacidad} personas)
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {error && (
            <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: '9px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', color: C.pink, fontSize: '13px', fontWeight: '600' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button onClick={onClose}
              style={{ flex: 1, background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '12px', color: C.textSecondary, fontFamily: FONT, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ flex: 2, background: saving ? C.bgCard : C.purple, border: `1.5px solid ${saving ? C.border : C.purple}`, borderRadius: '10px', padding: '12px', color: saving ? C.textMuted : '#fff', fontFamily: FONT, fontWeight: '800', fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: saving ? 'none' : glow(C.purple, '44'), transition: 'all 0.2s' }}>
              <Save size={14} /> {saving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN USERS PAGE
═══════════════════════════════════════════════════════════════ */
const AdminUsers = () => {
  const { user: currentUser } = useAuth();

  const [users,            setUsers]            = useState([]);
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [refreshing,       setRefreshing]       = useState(false);
  const [error,            setError]            = useState('');
  const [search,           setSearch]           = useState('');
  const [searchInput,      setSearchInput]      = useState(''); // valor del input (live)
  const [rolFilter,        setRolFilter]        = useState('');
  const [searchFocus,      setSearchFocus]      = useState(false);
  const [modal,            setModal]            = useState(null);

  // ── Carga de datos ────────────────────────────────────────────
  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const [usrs, mesas] = await Promise.all([
        usersService.getAll(),
        usersService.getMesasDisponibles(),
      ]);
      setUsers(usrs);
      setMesasDisponibles(mesas);
      setError('');
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Debounce del buscador — 300ms ────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Filtrado en memoria ───────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.nombre.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    if (rolFilter) list = list.filter(u => u.rol === rolFilter);
    return list;
  }, [users, search, rolFilter]);

  // ── CRUD ──────────────────────────────────────────────────────
  const handleSave = async (payload, id) => {
    if (id) await usersService.update(id, payload);
    else    await usersService.create(payload);
    // Recarga silenciosa + limpia búsqueda para que el nuevo usuario aparezca
    setSearchInput('');
    setSearch('');
    setRolFilter('');
    await load(true);
  };

  const handleDelete = async (id) => {
    try {
      await usersService.delete(id);
      await load(true);
    } catch (e) {
      alert(e.response?.data?.message || 'Error al eliminar.');
    }
  };

  const clearFilters = () => { setSearchInput(''); setSearch(''); setRolFilter(''); };
  const hasFilters = searchInput || rolFilter;

  const countByRol = useMemo(() => {
    const c = {};
    users.forEach(u => { c[u.rol] = (c[u.rol] || 0) + 1; });
    return c;
  }, [users]);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, color: C.textPrimary }}>
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* Título */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Users size={16} color={C.purple} />
              <span style={{ color: C.textMuted, fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Gestión de Usuarios</span>
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(20px,4vw,28px)', fontWeight: '800', color: C.textPrimary }}>Usuarios</h1>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(ROLES).map(([key, cfg]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: cfg.color, fontSize: '13px', fontWeight: '700' }}>
                  <cfg.Icon size={12} /> {countByRol[key] || 0} {cfg.label}{(countByRol[key] || 0) !== 1 ? 's' : ''}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Botón refresh manual */}
            <button onClick={() => load(true)} disabled={refreshing}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '10px', color: C.textSecondary, cursor: refreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
              title="Actualizar lista"
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.color = C.purple; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}>
              <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            </button>

            <button onClick={() => setModal('create')}
              style={{ background: C.purple, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontFamily: FONT, fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: glow(C.purple, '55'), transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <Users size={16} /> Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <Filter size={15} color={C.textMuted} style={{ flexShrink: 0 }} />

          {/* Buscador con debounce */}
          <div style={{ position: 'relative', flex: '1 1 220px', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color={searchFocus ? C.purple : C.textMuted}
              style={{ position: 'absolute', left: '10px', pointerEvents: 'none', transition: 'color 0.18s' }} />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder="Buscar por nombre o email..."
              style={{ width: '100%', boxSizing: 'border-box', background: C.bg, border: `1.5px solid ${searchFocus ? C.purple : C.border}`, borderRadius: '9px', padding: '8px 32px 8px 30px', color: C.textPrimary, fontFamily: FONT, fontWeight: '600', fontSize: '13px', outline: 'none', transition: 'border-color 0.18s' }} />
            {/* Indicador de que está filtrando */}
            {searchInput && searchInput !== search && (
              <div style={{ position: 'absolute', right: '30px', width: '6px', height: '6px', borderRadius: '50%', background: C.purple, animation: 'pulse 0.8s ease infinite' }} />
            )}
            {searchInput && (
              <button onClick={() => { setSearchInput(''); setSearch(''); }}
                style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex', padding: '2px' }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filtro rol */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {Object.entries(ROLES).map(([key, cfg]) => (
              <button key={key} onClick={() => setRolFilter(r => r === key ? '' : key)}
                style={{ background: rolFilter === key ? `${cfg.color}20` : 'transparent', border: `1.5px solid ${rolFilter === key ? cfg.color : C.border}`, borderRadius: '20px', padding: '5px 12px', color: rolFilter === key ? cfg.color : C.textMuted, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s' }}>
                <cfg.Icon size={11} /> {cfg.label}
                {countByRol[key] ? (
                  <span style={{ background: rolFilter === key ? `${cfg.color}30` : `${C.border}`, borderRadius: '20px', padding: '0 5px', fontSize: '10px', fontWeight: '800' }}>
                    {countByRol[key]}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button onClick={clearFilters}
              style={{ background: `${C.pink}12`, border: `1.5px solid ${C.pink}44`, borderRadius: '9px', padding: '7px 12px', color: C.pink, fontFamily: FONT, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              onMouseEnter={e => e.currentTarget.style.background = `${C.pink}22`}
              onMouseLeave={e => e.currentTarget.style.background = `${C.pink}12`}>
              <X size={12} /> Limpiar
            </button>
          )}

          {/* Contador resultados */}
          {(search || rolFilter) && (
            <span style={{ color: C.textMuted, fontSize: '12px', marginLeft: 'auto', flexShrink: 0 }}>
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Grid */}
        {error ? (
          <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '10px', color: C.pink, fontSize: '14px', fontWeight: '600' }}>
            <AlertCircle size={18} /> {error}
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ display: 'inline-block', width: '44px', height: '44px', border: `3px solid ${C.border}`, borderTopColor: C.purple, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: '16px', color: C.textMuted, fontSize: '14px' }}>Cargando usuarios...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${C.purple}12`, border: `1.5px solid ${C.purple}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Users size={28} color={C.purple} />
            </div>
            <h3 style={{ color: C.textPrimary, margin: '0 0 8px', fontWeight: '800' }}>
              {hasFilters ? 'Sin resultados' : 'No hay usuarios aún'}
            </h3>
            {hasFilters && (
              <button onClick={clearFilters} style={{ background: C.purple, color: '#fff', border: 'none', borderRadius: '9px', padding: '10px 22px', fontFamily: FONT, fontWeight: '700', fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}>
                Ver todos
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filtered.map(u => (
              <UserCard key={u.id} user={u}
                currentUserId={currentUser?.id}
                onEdit={u => setModal(u)}
                onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {modal && (
        <UserModal
          user={modal === 'create' ? null : modal}
          mesasDisponibles={mesasDisponibles}
          onSave={handleSave}
          onClose={() => setModal(null)} />
      )}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
};

export default AdminUsers;