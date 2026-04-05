import { useState, useEffect } from "react";
import { C, FONT, glow } from "../../../../styles/designTokens";
import { X, Save, ChefHat } from "lucide-react";
import Button from "../../../../components/common/Button";

/* ─── FIELD LABEL ────────────────────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <label
      style={{
        display: "block",
        color: C.textMuted,
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.9px",
        textTransform: "uppercase",
        marginBottom: "6px",
        fontFamily: FONT,
      }}
    >
      {children}
    </label>
  );
}

/* ─── DARK INPUT ─────────────────────────────────────────────── */
function DarkInput({
  id,
  name,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder || ""}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: C.bg,
        border: `1.5px solid ${focused ? C.pink : C.border}`,
        borderRadius: "10px",
        padding: "10px 14px",
        color: C.textPrimary,
        fontFamily: FONT,
        fontWeight: "600",
        fontSize: "13px",
        outline: "none",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: focused ? glow(C.pink, "18") : "none",
      }}
    />
  );
}

/* ─── DARK TEXTAREA ──────────────────────────────────────────── */
function DarkTextarea({ id, name, value, onChange, placeholder, rows = 3 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || ""}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: C.bg,
        border: `1.5px solid ${focused ? C.pink : C.border}`,
        borderRadius: "10px",
        padding: "10px 14px",
        color: C.textPrimary,
        fontFamily: FONT,
        fontWeight: "600",
        fontSize: "13px",
        outline: "none",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: focused ? glow(C.pink, "18") : "none",
        resize: "vertical",
      }}
    />
  );
}

/* ─── DARK SELECT MODAL ──────────────────────────────────────── */
function DarkSelectModal({ id, name, value, onChange, required, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: C.bg,
        border: `1.5px solid ${focused ? C.pink : C.border}`,
        borderRadius: "10px",
        padding: "10px 36px 10px 14px",
        color: C.textPrimary,
        fontFamily: FONT,
        fontWeight: "600",
        fontSize: "13px",
        outline: "none",
        cursor: "pointer",
        appearance: "none",
        WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C5040' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "calc(100% - 12px) center",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: focused ? glow(C.pink, "18") : "none",
      }}
    >
      {children}
    </select>
  );
}

/* ─── Cocineros MODAL ────────────────────────────────────────────── */
const DEFAULTS = {
  sNombre: "",
  sApellido: "",
  sEmail: "",
  sTelefono: "",
  dtFechaNacimiento: "",
  sDescripcion: "",
  sEspecialidad: "Tacos",
  sTurno: "mañana",
  bActivo: true,
};

const CocinerosModal = ({ isOpen, onClose, onSave, cook }) => {
  const [formData, setFormData] = useState(DEFAULTS);

  useEffect(() => {
    if (cook) {
      setFormData({
        ...cook,
        sTelefono: cook.sTelefono || "",
        dtFechaNacimiento: cook.dtFechaNacimiento || "",
        sDescripcion: cook.sDescripcion || "",
      });
    } else {
      setFormData({ ...DEFAULTS });
    }
  }, [cook, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isEdit = Boolean(cook);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
          zIndex: 400,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 401,
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: C.bgCard,
          border: `1.5px solid ${C.borderBright}`,
          borderRadius: "20px",
          boxShadow: `0 24px 64px rgba(0,0,0,0.55), ${glow(C.pink, "18")}`,
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, ${C.pink}, ${C.purple})`,
            borderRadius: "20px 20px 0 0",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: `${C.pink}18`,
                border: `1.5px solid ${C.pink}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChefHat size={17} color={C.pink} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  color: C.textPrimary,
                  fontWeight: "800",
                  fontSize: "18px",
                }}
              >
                {isEdit ? "Editar Cocinero" : "Nuevo Cocinero"}
              </h2>
              <p style={{ margin: 0, color: C.textMuted, fontSize: "12px" }}>
                {isEdit
                  ? `Modificando: ${cook.sNombre} ${cook.sApellido}`
                  : "Completa los datos del nuevo cocinero"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: C.bgCardHov,
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              display: "flex",
              color: C.textMuted,
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.pink;
              e.currentTarget.style.color = C.pink;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textMuted;
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          style={{ padding: "20px 24px 24px" }}
        >
          {/* Nombre + Apellido */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <FieldLabel>Nombre</FieldLabel>
              <DarkInput
                id="sNombre"
                name="sNombre"
                value={formData.sNombre}
                onChange={handleChange}
                required
                placeholder="Juan"
              />
            </div>
            <div>
              <FieldLabel>Apellido</FieldLabel>
              <DarkInput
                id="sApellido"
                name="sApellido"
                value={formData.sApellido}
                onChange={handleChange}
                required
                placeholder="García"
              />
            </div>
          </div>

          {/* Email + Teléfono */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <FieldLabel>Email</FieldLabel>
              <DarkInput
                id="sEmail"
                name="sEmail"
                type="email"
                value={formData.sEmail}
                onChange={handleChange}
                required
                placeholder="cook@itaquito.com"
              />
            </div>
            <div>
              <FieldLabel>Teléfono</FieldLabel>
              <DarkInput
                id="sTelefono"
                name="sTelefono"
                type="text"
                value={formData.sTelefono}
                onChange={handleChange}
                placeholder="4771234567"
              />
            </div>
          </div>

          {/* Especialidad + Turno */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <FieldLabel>Especialidad</FieldLabel>
              <DarkSelectModal
                id="sEspecialidad"
                name="sEspecialidad"
                value={formData.sEspecialidad}
                onChange={handleChange}
                required
              >
                <option value="Tacos">Tacos</option>
                <option value="Salsas">Salsas</option>
                <option value="Carnes">Carnes</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Postres">Postres</option>
              </DarkSelectModal>
            </div>
            <div>
              <FieldLabel>Turno</FieldLabel>
              <DarkSelectModal
                id="sTurno"
                name="sTurno"
                value={formData.sTurno}
                onChange={handleChange}
                required
              >
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
              </DarkSelectModal>
            </div>
          </div>

          {/* Fecha Nacimiento */}
          <div style={{ marginBottom: "16px" }}>
            <FieldLabel>Fecha de Nacimiento</FieldLabel>
            <DarkInput
              id="dtFechaNacimiento"
              name="dtFechaNacimiento"
              type="date"
              value={formData.dtFechaNacimiento}
              onChange={handleChange}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: "16px" }}>
            <FieldLabel>Descripción</FieldLabel>
            <DarkTextarea
              id="sDescripcion"
              name="sDescripcion"
              value={formData.sDescripcion}
              onChange={handleChange}
              placeholder="Experto en carnes asadas..."
            />
          </div>

          {/* bActivo (solo al editar) */}
          {isEdit && (
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                id="bActivo"
                name="bActivo"
                checked={formData.bActivo}
                onChange={handleChange}
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                  accentColor: C.pink,
                }}
              />
              <FieldLabel>Activo</FieldLabel>
            </div>
          )}

          <div
            style={{
              height: "1px",
              background: C.border,
              marginBottom: "18px",
            }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={14} />}
              fullWidth
            >
              {isEdit ? "Guardar cambios" : "Crear cocinero"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CocinerosModal;




