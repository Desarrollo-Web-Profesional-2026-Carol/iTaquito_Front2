import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usuariosService } from '../services/usuarios';
import UsuariosCard from '../components/interfaces/Administrador/Usuarios/UsuariosCard';
import UsuariosFilters from '../components/interfaces/Administrador/Usuarios/UsuariosFilters';
import UsuariosModal from '../components/interfaces/Administrador/Usuarios/UsuariosModal';
import ConfirmModal from '../components/ConfirmModal'; 
import { C, FONT, glow, ROLE_COLORS } from '../styles/designTokens';
import {
  Users, Plus, RefreshCw, Shield, Coffee, CreditCard, ChefHat, User
} from 'lucide-react';

/* ─── MINI STAT ──────────────────────────────────────────────── */
function MiniStat({ label, value, color, Icon }) {
  return (
    <div style={{
      background: C.bgCard, border: `1.5px solid ${C.border}`,
      borderTop: `3px solid ${color}`, borderRadius: "12px",
      padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", flex: "1 1 140px",
    }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "9px",
        background: `${color}18`, border: `1px solid ${color}33`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={17} color={color} />
      </div>
      <div>
        <div style={{ color, fontWeight: "800", fontSize: "22px", lineHeight: 1 }}>{value}</div>
        <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "2px", fontWeight: "600" }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── EMPTY STATE ────────────────────────────────────────────── */
function EmptyState({ isAdmin, onCreate }) {
  return (
    <div style={{
      textAlign: "center", padding: "72px 24px",
      background: C.bgCard, borderRadius: "20px", border: `1.5px solid ${C.border}`,
    }}>
      <div style={{
        width: "72px", height: "72px", borderRadius: "18px",
        background: `${C.teal}15`, border: `1.5px solid ${C.teal}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px", boxShadow: glow(C.teal, "22"),
      }}>
        <Users size={32} color={C.teal} />
      </div>
      <h3 style={{ color: C.textPrimary, margin: "0 0 8px", fontFamily: FONT, fontWeight: "800", fontSize: "18px" }}>
        No hay usuarios encontrados
      </h3>
      <p style={{ color: C.textSecondary, fontSize: "14px", margin: "0 0 24px" }}>
        {isAdmin ? "Agrega un nuevo usuario para empezar." : "Vuelve más tarde."}
      </p>
      {isAdmin && (
        <button onClick={onCreate} style={{
          background: C.teal, color: "#fff", border: "none",
          borderRadius: "10px", padding: "12px 24px",
          fontFamily: FONT, fontWeight: "700", fontSize: "14px",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
          boxShadow: glow(C.teal),
        }}>
          <Plus size={16} /> Agregar Usuario
        </button>
      )}
    </div>
  );
}

/* ─── USUARIOS PAGE ─────────────────────────────────────────────── */
const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usuariosService.getAll();
      
      let filtered = data || [];
      if (filters.nombre) {
        filtered = filtered.filter(u => u.nombre.toLowerCase().includes(filters.nombre.toLowerCase()));
      }
      if (filters.rol) {
        filtered = filtered.filter(u => u.rol === filters.rol);
      }

      setUsuarios(filtered);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { 
    loadUsuarios(); 
  }, [loadUsuarios]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsuarios();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleCreate = () => { 
    setSelectedUser(null); 
    setModalOpen(true); 
  };
  
  const handleEdit = (u) => { 
    setSelectedUser(u);  
    setModalOpen(true); 
  };

  const handleDeleteClick = (id) => {
    setDeleteModalId(id);
  };

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      await usuariosService.delete(deleteModalId); 
      await loadUsuarios();
      setDeleteModalId(null); 
    } catch (e) {
      alert(`Error al eliminar usuario: ${e.response?.data?.message || e.message}`);
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedUser) {
        await usuariosService.update(selectedUser.id, data);
      } else {
        await usuariosService.create(data);
      }
      setModalOpen(false);
      await loadUsuarios();
    } catch (e) { 
      alert(`Error: ${e.response?.data?.message || e.message}`);
    }
  };

  const total = usuarios.length;
  const admins = usuarios.filter(u => u.rol === 'admin').length;
  const meseros = usuarios.filter(u => u.rol === 'mesero').length;
  const cajas = usuarios.filter(u => u.rol === 'cajero').length;
  const clientes = usuarios.filter(u => u.rol === 'cliente').length;
  const taqueros = usuarios.filter(u => u.rol === 'taquero').length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.textPrimary }}>
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Users size={17} color={C.teal} />
              <span style={{ color: C.textMuted, fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Gestión
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(22px,4vw,28px)", fontWeight: "800", color: C.textPrimary, lineHeight: 1.1 }}>
              Usuarios
            </h1>
            <p style={{ margin: "4px 0 0", color: C.textMuted, fontSize: "13px" }}>
              {total} usuario{total !== 1 ? "s" : ""} registrado{total !== 1 ? "s" : ""}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={handleRefresh} style={{
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px",
              padding: "8px 14px", color: C.textSecondary, fontFamily: FONT,
              fontWeight: "600", fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}
            >
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.7s linear infinite" : "none" }} />
              Actualizar
            </button>

            {isAdmin && (
              <button onClick={handleCreate} style={{
                background: C.teal, color: "#fff", border: "none",
                borderRadius: "10px", padding: "8px 18px",
                fontFamily: FONT, fontWeight: "700", fontSize: "13px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                boxShadow: glow(C.teal), transition: "box-shadow 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = glow(C.teal, "88")}
                onMouseLeave={e => e.currentTarget.style.boxShadow = glow(C.teal)}
              >
                <Plus size={15} /> Nuevo Usuario
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          <MiniStat label="Admins" value={admins} color={ROLE_COLORS.admin} Icon={Shield} />
          <MiniStat label="Meseros" value={meseros} color={ROLE_COLORS.mesero} Icon={Coffee} />
          <MiniStat label="Cajeros" value={cajas} color={ROLE_COLORS.cajero} Icon={CreditCard} />
          <MiniStat label="Cocineros" value={taqueros} color={ROLE_COLORS.taquero} Icon={ChefHat} />
          <MiniStat label="Clientes" value={clientes} color={ROLE_COLORS.cliente} Icon={User} />
        </div>

        {/* Filtros */}
        <div style={{
          background: C.bgCard, border: `1px solid ${C.border}`,
          borderRadius: "14px", padding: "16px 20px", marginBottom: "24px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <UsuariosFilters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Contenido */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{
              display: "inline-block", width: "44px", height: "44px",
              border: `3px solid ${C.border}`, borderTopColor: C.teal,
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ marginTop: "16px", color: C.textMuted, fontSize: "14px" }}>Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <EmptyState isAdmin={isAdmin} onCreate={handleCreate} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "16px" }}>
            {usuarios.map(user => (
              <UsuariosCard 
                key={user.id} 
                usuario={user} 
                onEdit={handleEdit} 
                onDelete={handleDeleteClick} 
              />
            ))}
          </div>
        )}

      </main>

      <UsuariosModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSave} 
        usuario={selectedUser} 
      />
      
      {/* Utilizando el ConfirmModal existente de la referencia original si está disponible (o asumiendo que el archivo existe por el import) */}
      <ConfirmModal 
        isOpen={deleteModalId !== null} 
        onClose={() => setDeleteModalId(null)} 
        onConfirm={confirmDelete}
        title="¿Eliminar usuario de forma permanente?"
        message="Esta acción no se puede deshacer. El usuario perderá su acceso. Confirma que deseas eliminar el usuario por completo."
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Usuarios;
