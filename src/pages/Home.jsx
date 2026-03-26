import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils, Star, Clock, TrendingUp,
  ChevronRight, Flame, Award,
  Zap, ArrowRight, ThumbsUp, MessageCircle, LogIn
} from "lucide-react";
import { C, FONT } from "../styles/designTokens";

/* ─── DATA ───────────────────────────────────────────────────── */
const BESTSELLERS = [
  { id: 1, name: "Al Pastor", price: 25, desc: "Cerdo marinado, piña asada, cebolla y cilantro", tag: "#1 Más pedido",   tagIcon: TrendingUp, color: C.pink   },
  { id: 2, name: "Bistec",    price: 28, desc: "Carne asada, guacamole y pico de gallo",          tag: "Favorito del día", tagIcon: Flame,      color: C.orange },
  { id: 3, name: "Suadero",   price: 26, desc: "Suadero dorado, cebolla y salsa verde",            tag: "Clásico",         tagIcon: Award,      color: C.teal   },
];

const REVIEWS = [
  { name: "María G.",  stars: 5, text: "Los tacos de suadero están increíbles. Siempre vuelvo.",       time: "Hace 2 días", color: C.pink   },
  { name: "Carlos R.", stars: 5, text: "Pedí desde la tablet y llegó en 7 min. Sistema rapidísimo.",   time: "Ayer",        color: C.orange },
  { name: "Ana P.",    stars: 4, text: "Me encantó pedir desde la mesa. Experiencia única.",            time: "Hoy",         color: C.teal   },
];

const PICADO = [C.pink, C.orange, C.yellow, C.teal, C.purple, C.pinkDim, C.orangeDim, C.tealDim];

/* ─── PAPEL PICADO (SVG) ─────────────────────────────────────── */
function PapelPicado({ flip = false }) {
  const count = 16, w = 100 / count;
  return (
    <div style={{ width: "100%", lineHeight: 0, flexShrink: 0, transform: flip ? "scaleY(-1)" : "none" }}>
      <svg viewBox="0 0 100 12" preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "40px" }}
        xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: count }).map((_, i) => {
          const x = i * w;
          return <polygon key={i} points={`${x},0 ${x + w},0 ${x + w / 2},12`} fill={PICADO[i % PICADO.length]} />;
        })}
      </svg>
    </div>
  );
}



/* ─── SECTION HEADING ────────────────────────────────────────── */
function SectionHeading({ title, sub, color = C.pink }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <div style={{ width: "4px", height: "26px", borderRadius: "4px", background: color, boxShadow: `0 0 8px ${color}` }} />
        <h2 style={{ margin: 0, fontFamily: FONT, fontWeight: "800", fontSize: "clamp(18px,4vw,24px)", color: C.textPrimary }}>{title}</h2>
      </div>
      {sub && <p style={{ margin: "0 0 0 14px", fontFamily: FONT, fontSize: "13px", color: C.textSecondary }}>{sub}</p>}
    </div>
  );
}

/* ─── TACO CARD ──────────────────────────────────────────────── */
function TacoCard({ taco, onTap }) {
  const [hov, setHov] = useState(false);
  const TagIcon = taco.tagIcon;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onTap}
      style={{
        background: hov ? C.bgCardHov : C.bgCard,
        border: `1.5px solid ${hov ? taco.color : C.border}`,
        borderRadius: "16px", overflow: "hidden",
        display: "flex", flexDirection: "column",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 12px 32px rgba(0,0,0,0.4), 0 0 20px ${taco.color}22` : "0 2px 8px rgba(0,0,0,0.3)",
        transition: "all 0.25s ease", cursor: "pointer",
      }}
    >
      <div style={{ height: "6px", background: taco.color, boxShadow: `0 0 12px ${taco.color}66` }} />
      <div style={{ padding: "18px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: `${taco.color}18`, border: `1px solid ${taco.color}44`, color: taco.color, borderRadius: "20px", padding: "3px 10px", marginBottom: "12px", fontSize: "11px", fontWeight: "700", fontFamily: FONT }}>
          <TagIcon size={11} /> {taco.tag}
        </div>
        <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: `${taco.color}15`, border: `1.5px solid ${taco.color}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
          <Utensils size={24} color={taco.color} />
        </div>
        <h3 style={{ margin: "0 0 6px", fontFamily: FONT, fontWeight: "800", fontSize: "16px", color: C.textPrimary }}>
          Taco de {taco.name}
        </h3>
        <p style={{ margin: "0 0 16px", fontFamily: FONT, fontSize: "12.5px", color: C.textSecondary, lineHeight: "1.55" }}>
          {taco.desc}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: FONT, fontWeight: "800", fontSize: "20px", color: taco.color }}>${taco.price}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <ArrowRight size={14} color={taco.color} />
            <span style={{ color: taco.color, fontWeight: "700", fontSize: "12px", fontFamily: FONT }}>Ordenar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── REVIEW CARD ────────────────────────────────────────────── */
function ReviewCard({ r }) {
  return (
    <div style={{ background: C.bgCard, border: `1.5px solid ${C.border}`, borderLeft: `3px solid ${r.color}`, borderRadius: "14px", padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `${r.color}22`, border: `1.5px solid ${r.color}55`, display: "flex", alignItems: "center", justifyContent: "center", color: r.color, fontWeight: "800", fontSize: "13px", fontFamily: FONT }}>
            {r.name[0]}
          </div>
          <span style={{ fontFamily: FONT, fontWeight: "700", fontSize: "14px", color: C.textPrimary }}>{r.name}</span>
        </div>
        <span style={{ fontFamily: FONT, fontSize: "11px", color: C.textMuted }}>{r.time}</span>
      </div>
      <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
        {[1,2,3,4,5].map(s => (
          <Star key={s} size={13} color={s <= r.stars ? C.yellow : C.textMuted} fill={s <= r.stars ? C.yellow : "none"} />
        ))}
      </div>
      <p style={{ margin: 0, fontFamily: FONT, fontSize: "13px", color: C.textSecondary, lineHeight: "1.6" }}>"{r.text}"</p>
      <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
        <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontFamily: FONT, padding: 0 }}>
          <ThumbsUp size={12} /> Útil
        </button>
        <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontFamily: FONT, padding: 0 }}>
          <MessageCircle size={12} /> Responder
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();
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
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, overflowX: "hidden", color: C.textPrimary }}>

      <PapelPicado />

      {/* ── HERO ── */}
      <section style={{ background: C.bg, padding: "60px 24px 56px", textAlign: "center", position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ position: "absolute", top: "-80px", left: "10%", width: "300px", height: "300px", borderRadius: "50%", background: `${C.pink}0D`, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "10%", width: "280px", height: "280px", borderRadius: "50%", background: `${C.teal}0D`, filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(.34,1.2,.64,1)", position: "relative" }}>

          {/* Saludo + espera */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.borderBright}`, borderRadius: "30px", padding: "6px 16px", marginBottom: "20px", color: C.textSecondary, fontSize: "13px", fontWeight: "600", letterSpacing: "1px" }}>
            <Clock size={13} color={C.yellow} />
            {greeting} · Espera aprox. <strong style={{ color: C.orange }}>~8 min</strong>
          </div>

          <h1 style={{ color: C.cream, fontSize: "clamp(38px,9vw,72px)", fontWeight: "800", margin: "0 0 8px", lineHeight: 1.05, letterSpacing: "-1px" }}>
            Bienvenido a
          </h1>
          <h1 style={{ fontSize: "clamp(38px,9vw,72px)", fontWeight: "800", margin: "0 0 18px", lineHeight: 1.05, letterSpacing: "-1px", color: C.pink }}>
            iTaquito
          </h1>
          <p style={{ color: C.textSecondary, fontSize: "16px", margin: "0 0 36px", fontWeight: "500" }}>
            Explora nuestro menú y realiza tu pedido desde la mesa
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {/* Hacer mi pedido → /login */}
            <button
              onClick={() => navigate("/login")}
              style={{ background: C.pink, color: "#fff", border: "none", borderRadius: "12px", padding: "14px 30px", fontFamily: FONT, fontWeight: "800", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 0 24px ${C.pink}55`, transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 36px ${C.pink}88`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 24px ${C.pink}55`}
            >
              <Utensils size={16} /> Hacer mi pedido
            </button>

            {/* Iniciar sesión → /login */}
            <button
              onClick={() => navigate("/login")}
              style={{ background: "rgba(255,255,255,0.05)", color: C.textPrimary, border: `1px solid ${C.borderBright}`, borderRadius: "12px", padding: "14px 24px", fontFamily: FONT, fontWeight: "700", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderBright; e.currentTarget.style.color = C.textPrimary; }}
            >
              <LogIn size={15} color={C.teal} /> Iniciar sesión
            </button>
          </div>
        </div>
      </section>

      <PapelPicado flip />

    

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}