import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Utensils, LogIn } from "lucide-react";
import { C, FONT } from "../styles/designTokens";

/* ─── PAPEL PICADO ───────────────────────────────────────────── */
const PICADO = [C.pink, C.orange, C.yellow, C.teal, C.purple, C.pinkDim, C.orangeDim, C.tealDim];

function PapelPicado({ flip = false }) {
  const count = 20, w = 100 / count;
  return (
    <div style={{
      width: "100%",
      lineHeight: 0,
      flexShrink: 0,
      transform: flip ? "scaleY(-1)" : "none",
    }}>
      <svg
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "44px" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: count }).map((_, i) => {
          const x = i * w;
          return (
            <polygon
              key={i}
              points={`${x},0 ${x + w},0 ${x + w / 2},14`}
              fill={PICADO[i % PICADO.length]}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const navigate  = useNavigate();
  const [visible, setVisible] = useState(false);
  const [now,     setNow]     = useState(new Date());

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const h        = now.getHours();
  const greeting = h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      background: C.bg,
      fontFamily: FONT,
      color: C.textPrimary,
      display: "flex",
      flexDirection: "column",
    }}>

      {/* PAPEL PICADO SUPERIOR */}
      <PapelPicado />

      {/* ── HERO ── */}
      <section style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: 0,
      }}>

        {/* Degradado radial multi-color */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 15% 20%,  ${C.pink}1A   0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 85% 15%,  ${C.teal}16   0%, transparent 60%),
            radial-gradient(ellipse 55% 50% at 80% 85%,  ${C.orange}14 0%, transparent 60%),
            radial-gradient(ellipse 65% 45% at 20% 80%,  ${C.purple}14 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%,  ${C.yellow}0C 0%, transparent 55%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, ${C.bg}88 100%)`,
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Contenido */}
        <div style={{
          position: "relative",
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.75s cubic-bezier(.34,1.2,.64,1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          padding: "0 24px",
        }}>

          {/* Logo */}
          <img
            src="/logo.png"
            alt="iTaquito logo"
            style={{
              height: "250px",
              width: "auto",
              objectFit: "contain",
              marginBottom: "2px",
              filter: `
                drop-shadow(0 0 22px ${C.pink}55)
                drop-shadow(0 0 50px ${C.orange}30)
                drop-shadow(0 4px 12px rgba(0,0,0,0.45))
              `,
            }}
          />

          {/* Saludo pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${C.borderBright}`,
            borderRadius: "30px",
            padding: "5px 16px",
            color: C.textSecondary,
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "0.8px",
            backdropFilter: "blur(8px)",
          }}>
            <Clock size={12} color={C.yellow} />
            {greeting}
          </div>

          {/* Títulos — mismos tamaños, sin margen extra */}
          <div style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}>
            <div style={{
              color: C.cream,
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: "800",
            }}>
              Bienvenido a
            </div>
            <div style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: "800",
              color: C.pink,
              textShadow: `0 0 28px ${C.pink}66, 0 0 56px ${C.orange}33`,
            }}>
              iTaquito
            </div>
          </div>

          {/* Subtítulo */}
          <p style={{
            color: C.textSecondary,
            fontSize: "15px",
            margin: 0,
            fontWeight: "500",
            maxWidth: "380px",
            lineHeight: "1.5",
          }}>
            Explora nuestro menú y realiza tu pedido desde la mesa
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "4px",
          }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: C.pink, color: "#fff", border: "none",
                borderRadius: "12px", padding: "13px 30px",
                fontFamily: FONT, fontWeight: "800", fontSize: "15px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                boxShadow: `0 0 24px ${C.pink}55, 0 4px 14px rgba(0,0,0,0.3)`,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 0 40px ${C.pink}99, 0 4px 18px rgba(0,0,0,0.4)`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = `0 0 24px ${C.pink}55, 0 4px 14px rgba(0,0,0,0.3)`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Utensils size={15} /> Hacer mi pedido
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                background: "rgba(255,255,255,0.05)",
                color: C.textPrimary,
                border: `1.5px solid ${C.borderBright}`,
                borderRadius: "12px", padding: "13px 26px",
                fontFamily: FONT, fontWeight: "700", fontSize: "15px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.teal;
                e.currentTarget.style.color = C.teal;
                e.currentTarget.style.boxShadow = `0 0 18px ${C.teal}33`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.borderBright;
                e.currentTarget.style.color = C.textPrimary;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <LogIn size={14} color={C.teal} /> Iniciar sesión
            </button>
          </div>

        </div>
      </section>

      {/* PAPEL PICADO INFERIOR */}
      <PapelPicado flip />

    </div>
  );
}