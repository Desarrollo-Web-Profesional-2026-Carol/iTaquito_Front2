import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { usuariosService } from "../../../services/usuarios";
import UsuariosCard from "../components/Usuarios/UsuariosCard";
import UsuariosModal from "../components/Usuarios/UsuariosModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { C, FONT, glow, ROLE_COLORS } from "../../../styles/designTokens";
import {
  Users,
  Plus,
  RefreshCw,
  Shield,
  Coffee,
  CreditCard,
  ChefHat,
  User,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";

/* ─── ROLES PARA FILTRO ──────────────────────────────────────── */
const ROL_CHIPS = [
  { value: "", label: "Todos", Icon: SlidersHorizontal, color: C.teal },
  { value: "admin", label: "Admin", Icon: Shield, color: ROLE_COLORS.admin },
  { value: "mesero", label: "Mesero", Icon: Coffee, color: ROLE_COLORS.mesero },
  {
    value: "cajero",
    label: "Cajero",
    Icon: CreditCard,
    color: ROLE_COLORS.cajero,
  },
  {
    value: "taquero",
    label: "Taquero",
    Icon: ChefHat,
    color: ROLE_COLORS.taquero,
  },
  {
    value: "mesa",
    label: "Mesa",
    Icon: User,
    color: ROLE_COLORS.mesa,
  },
];

/* ─── MINI STAT ──────────────────────────────────────────────── */
function MiniStat({ label, value, color, Icon }) {
  return (
    <div
      style={{
        background: C.bgCard,
        border: `1.5px solid ${C.border}`,
        borderTop: `3px solid ${color}`,
        borderRadius: "12px",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flex: "1 1 140px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "9px",
          background: `${color}18`,
          border: `1px solid ${color}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={17} color={color} />
      </div>
      <div>
        <div
          style={{ color, fontWeight: "800", fontSize: "22px", lineHeight: 1 }}
        >
          {value}
        </div>
        <div
          style={{
            color: C.textMuted,
            fontSize: "11px",
            marginTop: "2px",
            fontWeight: "600",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/* ─── EMPTY STATE ────────────────────────────────────────────── */
function EmptyState({ isAdmin, onCreate }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "72px 24px",
        background: C.bgCard,
        borderRadius: "20px",
        border: `1.5px solid ${C.border}`,
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "18px",
          background: `${C.teal}15`,
          border: `1.5px solid ${C.teal}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: glow(C.teal, "22"),
        }}
      >
        <Users size={32} color={C.teal} />
      </div>
      <h3
        style={{
          color: C.textPrimary,
          margin: "0 0 8px",
          fontFamily: FONT,
          fontWeight: "800",
          fontSize: "18px",
        }}
      >
        No hay usuarios encontrados
      </h3>
      <p
        style={{ color: C.textSecondary, fontSize: "14px", margin: "0 0 24px" }}
      >
        {isAdmin
          ? "Agrega un nuevo usuario para empezar."
          : "Vuelve más tarde."}
      </p>
      {isAdmin && (
        <button
          onClick={onCreate}
          style={{
            background: C.teal,
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 24px",
            fontFamily: FONT,
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: glow(C.teal),
          }}
        >
          <Plus size={16} /> Agregar Usuario
        </button>
      )}
    </div>
  );
}

/* ─── USUARIOS PAGE ──────────────────────────────────────────── */
const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [activeRol, setActiveRol] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";

  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usuariosService.getAll();
      setUsuarios(data || []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  /* Filtrado en cliente para evitar recargas en cada keystroke */
  const filtered = usuarios.filter((u) => {
    const matchNombre =
      !searchVal || u.nombre?.toLowerCase().includes(searchVal.toLowerCase());
    const matchRol = !activeRol || u.rol === activeRol;
    return matchNombre && matchRol;
  });

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
  const handleDeleteClick = (id) => setDeleteModalId(id);

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      await usuariosService.delete(deleteModalId);
      await loadUsuarios();
      setDeleteModalId(null);
    } catch (e) {
      alert(
        `Error al eliminar usuario: ${e.response?.data?.message || e.message}`,
      );
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

  const clearFilters = () => {
    setSearchVal("");
    setActiveRol("");
  };
  const hasFilters = searchVal || activeRol;

  const total = usuarios.length;
  const admins = usuarios.filter((u) => u.rol === "admin").length;
  const meseros = usuarios.filter((u) => u.rol === "mesero").length;
  const cajas = usuarios.filter((u) => u.rol === "cajero").length;
  const mesas = usuarios.filter((u) => u.rol === "mesa").length;
  const taqueros = usuarios.filter((u) => u.rol === "taquero").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: FONT,
        color: C.textPrimary,
      }}
    >
      <main
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <Users size={17} color={C.teal} />
              <span
                style={{
                  color: C.textMuted,
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Gestión
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(22px,4vw,28px)",
                fontWeight: "800",
                color: C.textPrimary,
                lineHeight: 1.1,
              }}
            >
              Usuarios
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                color: C.textMuted,
                fontSize: "13px",
              }}
            >
              {filtered.length} de {total} usuario{total !== 1 ? "s" : ""}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={handleRefresh}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: "10px",
                padding: "8px 14px",
                color: C.textSecondary,
                fontFamily: FONT,
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.teal;
                e.currentTarget.style.color = C.teal;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.textSecondary;
              }}
            >
              <RefreshCw
                size={14}
                style={{
                  animation: refreshing ? "spin 0.7s linear infinite" : "none",
                }}
              />
              Actualizar
            </button>

            {isAdmin && (
              <button
                onClick={handleCreate}
                style={{
                  background: C.teal,
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 18px",
                  fontFamily: FONT,
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: glow(C.teal),
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = glow(C.teal, "88"))
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = glow(C.teal))
                }
              >
                <Plus size={15} /> Nuevo Usuario
              </button>
            )}
          </div>
        </div>

        {/* ── STATS ── */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <MiniStat
            label="Admins"
            value={admins}
            color={ROLE_COLORS.admin}
            Icon={Shield}
          />
          <MiniStat
            label="Meseros"
            value={meseros}
            color={ROLE_COLORS.mesero}
            Icon={Coffee}
          />
          <MiniStat
            label="Cajeros"
            value={cajas}
            color={ROLE_COLORS.cajero}
            Icon={CreditCard}
          />
          <MiniStat
            label="Taqueros"
            value={taqueros}
            color={ROLE_COLORS.taquero}
            Icon={ChefHat}
          />
          <MiniStat
            label="Mesas"
            value={mesas}
            color={ROLE_COLORS.mesa}
            Icon={User}
          />
        </div>

        {/* ── FILTROS ── */}
        <div
          style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: "14px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Búsqueda + limpiar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
              <Search
                size={15}
                color={C.textMuted}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: C.bg,
                  border: `1.5px solid ${searchVal ? C.teal : C.border}`,
                  borderRadius: "10px",
                  padding: "9px 36px 9px 36px",
                  color: C.textPrimary,
                  fontFamily: FONT,
                  fontSize: "13px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxShadow: searchVal ? `0 0 0 3px ${C.teal}18` : "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.teal)}
                onBlur={(e) =>
                  (e.target.style.borderColor = searchVal ? C.teal : C.border)
                }
              />
              {searchVal && (
                <button
                  onClick={() => setSearchVal("")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    color: C.textMuted,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{
                  background: "none",
                  border: `1px solid ${C.border}`,
                  borderRadius: "9px",
                  padding: "8px 14px",
                  color: C.textMuted,
                  fontFamily: FONT,
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.error;
                  e.currentTarget.style.color = C.error;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.textMuted;
                }}
              >
                <X size={13} /> Limpiar filtros
              </button>
            )}
          </div>

          {/* Chips de rol */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {ROL_CHIPS.map(({ value, label, Icon, color }) => {
              const active = activeRol === value;
              return (
                <button
                  key={value}
                  onClick={() => setActiveRol(value)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    background: active ? `${color}22` : C.bg,
                    border: `1.5px solid ${active ? color : C.border}`,
                    borderRadius: "20px",
                    padding: "5px 14px",
                    color: active ? color : C.textMuted,
                    fontFamily: FONT,
                    fontWeight: active ? "700" : "600",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    boxShadow: active ? `0 0 10px ${color}25` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.color = color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.color = C.textMuted;
                    }
                  }}
                >
                  <Icon size={12} /> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CONTENIDO ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div
              style={{
                display: "inline-block",
                width: "44px",
                height: "44px",
                border: `3px solid ${C.border}`,
                borderTopColor: C.teal,
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p
              style={{
                marginTop: "16px",
                color: C.textMuted,
                fontSize: "14px",
              }}
            >
              Cargando usuarios...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState isAdmin={isAdmin} onCreate={handleCreate} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "16px",
            }}
          >
            {filtered.map((u) => (
              <UsuariosCard
                key={u.id}
                usuario={u}
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



