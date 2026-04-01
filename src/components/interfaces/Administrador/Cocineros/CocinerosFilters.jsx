import { useState } from "react";
import { C, FONT, glow } from "../../../../styles/designTokens";
import { Search, X } from "lucide-react";

/* ─── SELECT OSCURO ──────────────────────────────────────────── */
function DarkSelect({ name, value, onChange, children, minWidth = "160px" }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        background: C.bg,
        border: `1.5px solid ${focused ? C.pink : C.border}`,
        borderRadius: "10px",
        padding: "9px 36px 9px 14px",
        color: value ? C.textPrimary : C.textMuted,
        fontFamily: FONT,
        fontWeight: "600",
        fontSize: "13px",
        cursor: "pointer",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C5040' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "calc(100% - 12px) center",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: focused ? glow(C.pink, "18") : "none",
        minWidth,
        flexShrink: 0,
      }}
    >
      {children}
    </select>
  );
}

/* ─── Cocineros FILTERS ──────────────────────────────────────────── */
const CocinerosFilters = ({ filters, onFilterChange }) => {
  const [searchFocused, setSearchFocused] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const hasActive = filters.sNombre || filters.sEspecialidad || filters.sTurno;

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Buscador nombre */}
      <div
        style={{
          flex: "1 1 220px",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Search
          size={15}
          color={searchFocused ? C.pink : C.textMuted}
          style={{
            position: "absolute",
            left: "12px",
            pointerEvents: "none",
            transition: "color 0.18s",
          }}
        />
        <input
          type="text"
          name="sNombre"
          value={filters.sNombre || ""}
          onChange={handleChange}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Buscar Cocineros..."
          style={{
            width: "100%",
            background: C.bg,
            border: `1.5px solid ${searchFocused ? C.pink : C.border}`,
            borderRadius: "10px",
            padding: "9px 36px 9px 36px",
            color: C.textPrimary,
            fontFamily: FONT,
            fontWeight: "600",
            fontSize: "13px",
            outline: "none",
            transition: "border-color 0.18s, box-shadow 0.18s",
            boxShadow: searchFocused ? glow(C.pink, "18") : "none",
          }}
        />
        {filters.sNombre && (
          <button
            onClick={() => onFilterChange({ ...filters, sNombre: "" })}
            style={{
              position: "absolute",
              right: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.textMuted,
              display: "flex",
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Especialidad */}
      <DarkSelect
        name="sEspecialidad"
        value={filters.sEspecialidad || ""}
        onChange={handleChange}
      >
        <option value="">Especialidad</option>
        <option value="Tacos">Tacos</option>
        <option value="Salsas">Salsas</option>
        <option value="Carnes">Carnes</option>
        <option value="Bebidas">Bebidas</option>
        <option value="Postres">Postres</option>
      </DarkSelect>

      {/* Turno */}
      <DarkSelect
        name="sTurno"
        value={filters.sTurno || ""}
        onChange={handleChange}
      >
        <option value="">Turno</option>
        <option value="mañana">Mañana</option>
        <option value="tarde">Tarde</option>
        <option value="noche">Noche</option>
      </DarkSelect>

      {/* Limpiar */}
      {hasActive && (
        <button
          onClick={() => onFilterChange({})}
          style={{
            background: `${C.pink}12`,
            border: `1.5px solid ${C.pink}44`,
            borderRadius: "10px",
            padding: "8px 14px",
            color: C.pink,
            fontFamily: FONT,
            fontWeight: "700",
            fontSize: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            whiteSpace: "nowrap",
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${C.pink}22`;
            e.currentTarget.style.borderColor = C.pink;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${C.pink}12`;
            e.currentTarget.style.borderColor = `${C.pink}44`;
          }}
        >
          <X size={12} /> Limpiar
        </button>
      )}
    </div>
  );
};

export default CocinerosFilters;
