import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { usuariosService } from "../../../services/usuarios";
import { authService } from "../../../services/auth";
import UsuariosCard from "../components/Usuarios/UsuariosCard";
import UsuariosModal from "../components/Usuarios/UsuariosModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { C, FONT, glow, ROLE_COLORS } from "../../../styles/designTokens";
import {
  Users, Plus, RefreshCw, Shield, Coffee, CreditCard,
  ChefHat, User, Search, X, SlidersHorizontal,
  ShieldCheck, ShieldOff, QrCode, Copy, CheckCircle,
  AlertCircle, Lock, KeyRound, Eye, EyeOff, Save,
} from "lucide-react";

/* ─── ROLES PARA FILTRO ──────────────────────────────────────── */
const ROL_CHIPS = [
  { value: "", label: "Todos", Icon: SlidersHorizontal, color: C.teal },
  { value: "admin",   label: "Administrador", Icon: Shield,      color: ROLE_COLORS.admin   },
  { value: "mesero",  label: "Mesero",  Icon: Coffee,      color: ROLE_COLORS.mesero  },
  { value: "cajero",  label: "Cajero",  Icon: CreditCard,  color: ROLE_COLORS.cajero  },
  { value: "taquero", label: "Taquero", Icon: ChefHat,     color: ROLE_COLORS.taquero },
  { value: "mesa",    label: "Mesa",    Icon: User,        color: ROLE_COLORS.mesa    },
];

/* ─── MINI STAT ──────────────────────────────────────────────── */
function MiniStat({ label, value, color, Icon }) {
  return (
    <div style={{
      background: C.bgCard, border: `1.5px solid ${C.border}`,
      borderTop: `3px solid ${color}`, borderRadius: "12px",
      padding: "14px 16px", display: "flex", alignItems: "center",
      gap: "12px", flex: "1 1 140px",
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
          background: C.teal, color: "#fff", border: "none", borderRadius: "10px",
          padding: "12px 24px", fontFamily: FONT, fontWeight: "700", fontSize: "14px",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
          boxShadow: glow(C.teal),
        }}>
          <Plus size={16} /> Agregar Usuario
        </button>
      )}
    </div>
  );
}

/* ─── MODAL 2FA SETUP ────────────────────────────────────────── */
function Modal2FASetup({ user, onClose, onDisable }) {
  const [step, setStep]               = useState("loading");
  const [qrUrl, setQrUrl]             = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [copiedIdx, setCopiedIdx]     = useState(null);
  const [error, setError]             = useState("");
  const [disabling, setDisabling]     = useState(false);

  useEffect(() => {
    if (!user.twoFactorEnabled) enableFor(user.id);
    else setStep("already");
  }, []);

  const enableFor = async (userId) => {
    setStep("loading"); setError("");
    try {
      const data = await authService.enable2FAForUser(userId); // ✅
      setQrUrl(data.qrCodeUrl);
      setBackupCodes(data.backupCodes);
      setStep("qr");
    } catch (e) {
      setError(e.response?.data?.message || "Error al activar 2FA");
      setStep("error");
    }
  };

  const handleDisable = async () => {
    setDisabling(true);
    try {
      await authService.disable2FAForUser(user.id); 
      onDisable(user.id);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || "Error al desactivar 2FA");
      setDisabling(false);
    }
  };

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopiedIdx(-1);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: C.bgAccent, border: `1.5px solid ${C.border}`,
        borderRadius: "20px", width: "100%", maxWidth: "480px",
        maxHeight: "90vh", overflow: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)", fontFamily: FONT,
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${C.purple}18`, border: `1px solid ${C.purple}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={17} color={C.purple} />
            </div>
            <div>
              <div style={{ color: C.textPrimary, fontWeight: "800", fontSize: "15px" }}>
                {user.twoFactorEnabled ? "Gestionar 2FA" : "Activar 2FA"}
              </div>
              <div style={{ color: C.textMuted, fontSize: "12px" }}>{user.nombre}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: "4px" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Loading */}
          {step === "loading" && (
            <div style={{ textAlign: "center", padding: "32px" }}>
              <RefreshCw size={28} color={C.purple} style={{ animation: "spin 0.8s linear infinite", marginBottom: "12px" }} />
              <p style={{ color: C.textMuted, fontSize: "13px", margin: 0 }}>Generando configuración 2FA...</p>
            </div>
          )}

          {/* Error */}
          {step === "error" && (
            <div style={{ textAlign: "center", padding: "16px" }}>
              <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: "10px", padding: "14px", color: C.pink, fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <AlertCircle size={15} /> {error}
              </div>
              <button onClick={onClose} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "10px 20px", color: C.textSecondary, fontFamily: FONT, fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                Cerrar
              </button>
            </div>
          )}

          {/* Ya tiene 2FA */}
          {step === "already" && (
            <div>
              <div style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}30`, borderRadius: "12px", padding: "16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                <ShieldCheck size={20} color={C.teal} />
                <div>
                  <div style={{ color: C.teal, fontWeight: "700", fontSize: "13px" }}>2FA activado</div>
                  <div style={{ color: C.textMuted, fontSize: "12px", marginTop: "2px" }}>{user.nombre} ya tiene verificación en dos pasos.</div>
                </div>
              </div>
              {error && (
                <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: C.pink, fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <p style={{ color: C.textSecondary, fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>
                ¿Deseas desactivar el 2FA? El usuario podrá iniciar sesión solo con correo y contraseña.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={onClose} style={{ flex: 1, background: "none", border: `1.5px solid ${C.border}`, borderRadius: "10px", padding: "11px", color: C.textSecondary, fontFamily: FONT, fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={handleDisable} disabled={disabling} style={{
                  flex: 1, background: disabling ? C.bgCard : C.pink, border: "none",
                  borderRadius: "10px", padding: "11px", color: disabling ? C.textMuted : "#fff",
                  fontFamily: FONT, fontWeight: "700", fontSize: "13px",
                  cursor: disabling ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                  transition: "all 0.2s", boxShadow: disabling ? "none" : glow(C.pink, "44"),
                }}>
                  {disabling
                    ? <><RefreshCw size={13} style={{ animation: "spin 0.7s linear infinite" }} /> Desactivando...</>
                    : <><ShieldOff size={14} /> Desactivar 2FA</>
                  }
                </button>
              </div>
            </div>
          )}

          {/* QR + códigos de respaldo */}
          {step === "qr" && (
            <div>
              <div style={{ background: `${C.purple}10`, border: `1px solid ${C.purple}28`, borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
                <div style={{ color: C.purple, fontWeight: "700", fontSize: "13px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <QrCode size={14} /> Escanea el código QR
                </div>
                <p style={{ color: C.textSecondary, fontSize: "12px", lineHeight: 1.6, margin: 0 }}>
                  El usuario debe escanearlo con <strong>Google Authenticator</strong>, <strong>Authy</strong> u otra app TOTP.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: `2px solid ${C.purple}33`, boxShadow: glow(C.purple, "22") }}>
                  <img src={qrUrl} alt="QR 2FA" style={{ width: "180px", height: "180px", display: "block" }} />
                </div>
              </div>

              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: C.textPrimary, fontWeight: "700", fontSize: "13px" }}>Códigos de respaldo</div>
                    <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "2px" }}>Solo se muestran una vez.</div>
                  </div>
                  <button onClick={copyAll} style={{
                    background: copiedIdx === -1 ? `${C.teal}18` : `${C.purple}12`,
                    border: `1px solid ${copiedIdx === -1 ? C.teal : C.purple}33`,
                    borderRadius: "7px", padding: "5px 10px",
                    color: copiedIdx === -1 ? C.teal : C.purple,
                    fontFamily: FONT, fontWeight: "700", fontSize: "11px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "4px",
                  }}>
                    {copiedIdx === -1 ? <><CheckCircle size={11} /> Copiados</> : <><Copy size={11} /> Copiar todos</>}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border }}>
                  {backupCodes.map((code, idx) => (
                    <button key={idx} onClick={() => copyCode(code, idx)} style={{
                      background: copiedIdx === idx ? `${C.teal}10` : C.bgCard,
                      border: "none", padding: "10px 14px",
                      fontFamily: "monospace", fontWeight: "700", fontSize: "14px",
                      color: copiedIdx === idx ? C.teal : C.textPrimary,
                      cursor: "pointer", textAlign: "left", letterSpacing: "2px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      {code}
                      {copiedIdx === idx ? <CheckCircle size={11} color={C.teal} /> : <Copy size={11} color={C.textMuted} style={{ opacity: 0.5 }} />}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}30`, borderRadius: "10px", padding: "10px 14px", marginBottom: "20px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <AlertCircle size={14} color={C.orange} style={{ flexShrink: 0, marginTop: "1px" }} />
                <p style={{ margin: 0, color: C.orange, fontSize: "12px", fontWeight: "600", lineHeight: 1.5 }}>
                  Asegúrate de que el usuario guarde estos códigos. No podrán verse de nuevo.
                </p>
              </div>

              <button onClick={() => setStep("done")} style={{
                width: "100%", background: C.purple, border: "none",
                borderRadius: "10px", padding: "12px", color: "#fff",
                fontFamily: FONT, fontWeight: "800", fontSize: "14px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: glow(C.purple, "44"),
              }}>
                <CheckCircle size={15} /> Listo, 2FA activado
              </button>
            </div>
          )}

          {/* Done */}
          {step === "done" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${C.teal}18`, border: `1.5px solid ${C.teal}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: glow(C.teal, "22") }}>
                <ShieldCheck size={26} color={C.teal} />
              </div>
              <h3 style={{ margin: "0 0 8px", color: C.textPrimary, fontWeight: "800", fontSize: "17px" }}>2FA activado correctamente</h3>
              <p style={{ margin: "0 0 20px", color: C.textMuted, fontSize: "13px", lineHeight: 1.6 }}>
                {user.nombre} ahora necesitará su app autenticadora al iniciar sesión.
              </p>
              <button onClick={onClose} style={{ background: C.teal, color: "#fff", border: "none", borderRadius: "10px", padding: "11px 28px", fontFamily: FONT, fontWeight: "700", fontSize: "13px", cursor: "pointer", boxShadow: glow(C.teal, "44") }}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL RESET PASSWORD ───────────────────────────────────── */
function ModalResetPassword({ user, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [saving, setSaving]           = useState(false);
  const [done, setDone]               = useState(false);
  const [error, setError]             = useState("");

  const handleSave = async () => {
    if (newPassword.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    setSaving(true); setError("");
    try {
      await authService.adminResetPassword(user.id, newPassword); // ✅
      setDone(true);
    } catch (e) {
      setError(e.response?.data?.message || "Error al restablecer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: C.bgAccent, border: `1.5px solid ${C.border}`,
        borderRadius: "20px", width: "100%", maxWidth: "400px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)", fontFamily: FONT,
      }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${C.orange}18`, border: `1px solid ${C.orange}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={16} color={C.orange} />
            </div>
            <div>
              <div style={{ color: C.textPrimary, fontWeight: "800", fontSize: "15px" }}>Restablecer contraseña</div>
              <div style={{ color: C.textMuted, fontSize: "12px" }}>{user.nombre}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: "4px" }}><X size={18} /></button>
        </div>

        <div style={{ padding: "24px" }}>
          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `${C.teal}18`, border: `1.5px solid ${C.teal}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: glow(C.teal, "22") }}>
                <CheckCircle size={24} color={C.teal} />
              </div>
              <h3 style={{ margin: "0 0 8px", color: C.textPrimary, fontWeight: "800" }}>¡Contraseña actualizada!</h3>
              <p style={{ margin: "0 0 20px", color: C.textMuted, fontSize: "13px" }}>
                Comunica la nueva contraseña a {user.nombre} de forma segura.
              </p>
              <button onClick={onClose} style={{ background: C.teal, color: "#fff", border: "none", borderRadius: "10px", padding: "11px 28px", fontFamily: FONT, fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                Cerrar
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: C.pink, fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ color: C.textSecondary, fontSize: "12px", fontWeight: "700", marginBottom: "6px", display: "block" }}>
                  Nueva contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <KeyRound size={13} color={C.textMuted} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    style={{
                      width: "100%", boxSizing: "border-box", background: C.bg,
                      border: `1.5px solid ${C.border}`, borderRadius: "9px",
                      padding: "10px 36px 10px 28px", color: C.textPrimary,
                      fontFamily: FONT, fontWeight: "600", fontSize: "13px", outline: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = C.orange}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                  <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.textMuted, display: "flex" }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={onClose} style={{ flex: 1, background: "none", border: `1.5px solid ${C.border}`, borderRadius: "10px", padding: "11px", color: C.textSecondary, fontFamily: FONT, fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving || newPassword.length < 6} style={{
                  flex: 1, background: saving ? C.bgCard : C.orange, border: "none",
                  borderRadius: "10px", padding: "11px", color: saving ? C.textMuted : "#fff",
                  fontFamily: FONT, fontWeight: "700", fontSize: "13px",
                  cursor: (saving || newPassword.length < 6) ? "not-allowed" : "pointer",
                  opacity: newPassword.length < 6 ? 0.6 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                  boxShadow: saving ? "none" : glow(C.orange, "44"), transition: "all 0.2s",
                }}>
                  {saving
                    ? <><RefreshCw size={13} style={{ animation: "spin 0.7s linear infinite" }} /> Guardando...</>
                    : <><Save size={13} /> Guardar</>
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── USUARIOS PAGE ──────────────────────────────────────────── */
const Usuarios = () => {
  const [usuarios, setUsuarios]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [refreshing, setRefreshing]           = useState(false);
  const [searchVal, setSearchVal]             = useState("");
  const [activeRol, setActiveRol]             = useState("");
  const [modalOpen, setModalOpen]             = useState(false);
  const [selectedUser, setSelectedUser]       = useState(null);
  const [deleteModalId, setDeleteModalId]     = useState(null);
  const [modal2FA, setModal2FA]               = useState(null);
  const [modalResetPass, setModalResetPass]   = useState(null);
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

  useEffect(() => { loadUsuarios(); }, [loadUsuarios]);

  const filtered = usuarios.filter((u) => {
    const matchNombre = !searchVal || u.nombre?.toLowerCase().includes(searchVal.toLowerCase());
    const matchRol    = !activeRol || u.rol === activeRol;
    return matchNombre && matchRol;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsuarios();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleCreate      = () => { setSelectedUser(null); setModalOpen(true); };
  const handleEdit        = (u) => { setSelectedUser(u); setModalOpen(true); };
  const handleDeleteClick = (id) => setDeleteModalId(id);

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
      if (selectedUser) await usuariosService.update(selectedUser.id, data);
      else await usuariosService.create(data);
      setModalOpen(false);
      await loadUsuarios();
    } catch (e) {
      alert(`Error: ${e.response?.data?.message || e.message}`);
    }
  };

  const handle2FADisabled = (userId) => {
    setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, twoFactorEnabled: false } : u));
  };

  const clearFilters = () => { setSearchVal(""); setActiveRol(""); };
  const hasFilters   = searchVal || activeRol;

  const total    = usuarios.length;
  const admins   = usuarios.filter(u => u.rol === "admin").length;
  const meseros  = usuarios.filter(u => u.rol === "mesero").length;
  const cajas    = usuarios.filter(u => u.rol === "cajero").length;
  const mesas    = usuarios.filter(u => u.rol === "mesa").length;
  const taqueros = usuarios.filter(u => u.rol === "taquero").length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.textPrimary }}>
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Users size={17} color={C.teal} />
              <span style={{ color: C.textMuted, fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase" }}>Gestión</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(22px,4vw,28px)", fontWeight: "800", color: C.textPrimary, lineHeight: 1.1 }}>
              Usuarios
            </h1>
            <p style={{ margin: "4px 0 0", color: C.textMuted, fontSize: "13px" }}>
              {filtered.length} de {total} usuario{total !== 1 ? "s" : ""}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={handleRefresh} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "8px 14px", color: C.textSecondary, fontFamily: FONT, fontWeight: "600", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}>
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.7s linear infinite" : "none" }} />
              Actualizar
            </button>
            {isAdmin && (
              <button onClick={handleCreate} style={{ background: C.teal, color: "#fff", border: "none", borderRadius: "10px", padding: "8px 18px", fontFamily: FONT, fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: glow(C.teal) }}>
                <Plus size={15} /> Nuevo Usuario
              </button>
            )}
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          <MiniStat label="Admins"   value={admins}   color={ROLE_COLORS.admin}   Icon={Shield}      />
          <MiniStat label="Meseros"  value={meseros}  color={ROLE_COLORS.mesero}  Icon={Coffee}      />
          <MiniStat label="Cajeros"  value={cajas}    color={ROLE_COLORS.cajero}  Icon={CreditCard}  />
          <MiniStat label="Taqueros" value={taqueros} color={ROLE_COLORS.taquero} Icon={ChefHat}     />
          <MiniStat label="Mesas"    value={mesas}    color={ROLE_COLORS.mesa}    Icon={User}        />
        </div>

        {/* ── FILTROS ── */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
              <Search size={15} color={C.textMuted} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input
                type="text" placeholder="Buscar por nombre..."
                value={searchVal} onChange={e => setSearchVal(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", background: C.bg, border: `1.5px solid ${searchVal ? C.teal : C.border}`, borderRadius: "10px", padding: "9px 36px 9px 36px", color: C.textPrimary, fontFamily: FONT, fontSize: "13px", outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = C.teal}
                onBlur={e => e.target.style.borderColor = searchVal ? C.teal : C.border}
              />
              {searchVal && (
                <button onClick={() => setSearchVal("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "2px", color: C.textMuted, display: "flex", alignItems: "center" }}>
                  <X size={14} />
                </button>
              )}
            </div>
            {hasFilters && (
              <button onClick={clearFilters} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: "9px", padding: "8px 14px", color: C.textMuted, fontFamily: FONT, fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", transition: "all 0.18s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.error; e.currentTarget.style.color = C.error; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}>
                <X size={13} /> Limpiar filtros
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {ROL_CHIPS.map(({ value, label, Icon, color }) => {
              const active = activeRol === value;
              return (
                <button key={value} onClick={() => setActiveRol(value)} style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: active ? `${color}22` : C.bg, border: `1.5px solid ${active ? color : C.border}`, borderRadius: "20px", padding: "5px 14px", color: active ? color : C.textMuted, fontFamily: FONT, fontWeight: active ? "700" : "600", fontSize: "12px", cursor: "pointer", transition: "all 0.18s ease", boxShadow: active ? `0 0 10px ${color}25` : "none" }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; } }}>
                  <Icon size={12} /> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CONTENIDO ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ display: "inline-block", width: "44px", height: "44px", border: `3px solid ${C.border}`, borderTopColor: C.teal, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ marginTop: "16px", color: C.textMuted, fontSize: "14px" }}>Cargando usuarios...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState isAdmin={isAdmin} onCreate={handleCreate} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "16px" }}>
            {filtered.map(u => (
              <UsuariosCard
                key={u.id}
                usuario={u}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                on2FA={setModal2FA}
                onResetPassword={setModalResetPass}
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
        message="Esta acción no se puede deshacer. El usuario perderá su acceso."
      />

      {modal2FA && (
        <Modal2FASetup
          user={modal2FA}
          onClose={() => { setModal2FA(null); loadUsuarios(); }}
          onDisable={handle2FADisabled}
        />
      )}

      {modalResetPass && (
        <ModalResetPassword
          user={modalResetPass}
          onClose={() => setModalResetPass(null)}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Usuarios;