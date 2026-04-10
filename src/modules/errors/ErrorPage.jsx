import { useNavigate } from "react-router-dom";
import { C, FONT } from "../../styles/designTokens";

const ERRORS = {
  404: { badge: "Error 404", title: "¡Se perdió el taco!", desc: "Esta página no existe o fue movida. Tal vez alguien se la comió por accidente." },
  500: { badge: "Error 500", title: "¡Se quemó la plancha!", desc: "Algo salió mal en la cocina. Ya estamos arreglándolo, vuelve en un momento." },
  403: { badge: "Error 403", title: "Aquí no entra cualquiera", desc: "No tienes permiso para ver esto. ¿Eres del equipo? Inicia sesión primero." },
};

const keyframes = `
  @keyframes numWobble { 0%,100% { transform: translate(-50%,-50%) scale(1) rotate(-1deg); } 50% { transform: translate(-50%,-52%) scale(1.03) rotate(1deg); } }
  @keyframes contentIn { from { opacity: 0; transform: translateY(30px) scale(0.93); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes forkSearch { 0%,100% { transform: rotate(-8deg) translateY(0); } 25% { transform: rotate(6deg) translateY(-6px); } 50% { transform: rotate(-4deg) translateY(-3px); } 75% { transform: rotate(10deg) translateY(-8px); } }
  @keyframes knifeSearch { 0%,100% { transform: rotate(8deg) translateY(0); } 25% { transform: rotate(-6deg) translateY(-8px); } 50% { transform: rotate(4deg) translateY(-4px); } 75% { transform: rotate(-10deg) translateY(-6px); } }
  @keyframes plateFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  @keyframes emptyPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.25); } }
  @keyframes steamRise { 0% { opacity: 0; height: 0; transform: translateY(0); } 20% { opacity: 0.5; height: 14px; } 60% { opacity: 0.3; height: 18px; transform: translateY(-12px); } 100% { opacity: 0; height: 10px; transform: translateY(-22px); } }
  @keyframes flyOrbit { from { transform: rotate(0deg) translateX(46px) rotate(0deg); } to { transform: rotate(360deg) translateX(46px) rotate(-360deg); } }
  @keyframes wingFlap { from { transform: scaleY(1) rotate(-20deg); } to { transform: scaleY(0.3) rotate(-20deg); } }
  @keyframes floatUp { 0% { opacity: 0; transform: translateY(0) rotate(0deg); } 15% { opacity: 0.11; } 85% { opacity: 0.11; } 100% { opacity: 0; transform: translateY(-300px) rotate(30deg); } }
  @keyframes lineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
`;

const FLOATIES = ["🌮","🌶","🧅","🌿","🫙","🍋","🧄","🥑"];

export default function ErrorPage({ code = 404 }) {
  const navigate = useNavigate();
  const content = ERRORS[code] ?? ERRORS[404];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", position: "relative", overflow: "hidden" }}>
      <style>{keyframes}</style>

      <div style={{ position: "absolute", fontFamily: FONT,
        fontSize: "clamp(110px, 22vw, 200px)", fontWeight: 800,
        color: C.bgCardHov, letterSpacing: "-0.06em", userSelect: "none",
        top: "50%", left: "50%", whiteSpace: "nowrap", lineHeight: 1,
        animation: "numWobble 6s ease-in-out infinite" }}>
        {code}
      </div>

      {FLOATIES.map((item, i) => (
        <span key={i} style={{
          position: "absolute", left: `${4 + (i * 13) % 90}%`,
          top: `${20 + (i * 17) % 65}%`, fontSize: `${14 + (i % 3) * 4}px`,
          opacity: 0, pointerEvents: "none",
          animation: `floatUp ${6 + i % 5}s ${i * 0.6}s infinite ease-in-out`,
        }}>{item}</span>
      ))}

      <div style={{ position: "relative", zIndex: 1, textAlign: "center",
        maxWidth: 420, animation: "contentIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both" }}>

        <div style={{ width: 110, height: 110, margin: "0 auto 1.1rem", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", bottom: 52,
            transform: "translateX(-50%)", display: "flex", gap: 7, alignItems: "flex-end" }}>
            {[{d:"1.8s",dd:"0s"},{d:"2.2s",dd:"0.4s"},{d:"1.6s",dd:"0.8s"}].map((s,i) => (
              <div key={i} style={{ width: 3, height: 16, borderRadius: 99,
                background: C.border, opacity: 0,
                animation: `steamRise ${s.d} ${s.dd} ease-in-out infinite` }} />
            ))}
          </div>

          <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
            <g style={{ transformOrigin: "26px 70px", animation: "forkSearch 3s 1s ease-in-out infinite" }}>
              <line x1="26" y1="22" x2="26" y2="68" stroke={C.pinkLight} strokeWidth="3" strokeLinecap="round"/>
              <line x1="21" y1="22" x2="21" y2="36" stroke={C.pinkLight} strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="26" y1="22" x2="26" y2="36" stroke={C.pinkLight} strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="31" y1="22" x2="31" y2="36" stroke={C.pinkLight} strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M21 36 Q26 42 31 36" fill="none" stroke={C.pinkLight} strokeWidth="2.2"/>
            </g>
            <g style={{ transformOrigin: "82px 70px", animation: "knifeSearch 3s 1.3s ease-in-out infinite" }}>
              <line x1="82" y1="22" x2="82" y2="68" stroke={C.orangeLight} strokeWidth="3" strokeLinecap="round"/>
              <path d="M82 22 Q92 32 82 46" fill={C.orangeLight} fillOpacity="0.5" stroke={C.orangeLight} strokeWidth="1.5"/>
            </g>
            <ellipse cx="54" cy="82" rx="26" ry="6" fill={C.bgCardHov} opacity="0.5"/>
            <g style={{ animation: "plateFloat 4s 0.8s ease-in-out infinite" }}>
              <ellipse cx="54" cy="76" rx="26" ry="7.5" fill={C.bgCard} stroke={C.border} strokeWidth="1.5"/>
              <ellipse cx="54" cy="73" rx="26" ry="7.5" fill={C.bgCard} stroke={C.border} strokeWidth="1.5"/>
              <ellipse cx="54" cy="70" rx="18" ry="5.5" fill={C.bg} stroke={C.border} strokeWidth="1"/>
              <circle cx="54" cy="69" r="7" fill="none" stroke={C.orange}
                strokeWidth="2" strokeDasharray="3.5 3"
                style={{ transformOrigin: "54px 69px", animation: "emptyPulse 2.2s 1s ease-in-out infinite" }}/>
            </g>
          </svg>

          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            pointerEvents: "none", animation: "flyOrbit 4s linear infinite",
            transformOrigin: "55px 55px" }}>
            <div style={{ position: "absolute", top: 2, left: 48, width: 10, height: 7,
              background: C.cream, borderRadius: "50%" }}>
              <div style={{ position: "absolute", top: -4, left: -5, width: 8, height: 5,
                background: C.teal + "55", borderRadius: "50%",
                animation: "wingFlap 0.1s linear infinite alternate" }} />
              <div style={{ position: "absolute", top: -4, right: -5, width: 8, height: 5,
                background: C.teal + "55", borderRadius: "50%",
                animation: "wingFlap 0.1s linear infinite alternate" }} />
            </div>
          </div>
        </div>

        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 14px",
          borderRadius: 999, background: C.bgCard, color: C.textSecondary,
          border: `1px solid ${C.border}`, marginBottom: "0.9rem",
          animation: "fadeSlide 0.5s 0.4s both" }}>
          {content.badge}
        </span>

        <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.9rem)", fontWeight: 800,
          color: C.textPrimary, margin: "0 0 0.5rem", lineHeight: 1.2,
          animation: "fadeSlide 0.5s 0.5s both" }}>
          {content.title}
        </h1>

        <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65,
          margin: 0, fontWeight: 500, animation: "fadeSlide 0.5s 0.6s both" }}>
          {content.desc}
        </p>

        <div style={{ height: 4, borderRadius: 99, margin: "0.9rem auto 1.5rem", width: 80,
          transformOrigin: "center",
          background: `linear-gradient(90deg, ${C.pink}, ${C.orange}, ${C.yellow}, ${C.teal}, ${C.purple})`,
          animation: "lineGrow 0.5s 0.7s both" }} />

        <div style={{ display: "flex", gap: 10, justifyContent: "center",
          flexWrap: "wrap", animation: "fadeSlide 0.5s 0.75s both" }}>
          <button onClick={() => navigate("/", { replace: true })}
            style={{ background: C.pink, color: C.bg, border: "none",
              padding: "11px 24px", borderRadius: 10, fontFamily: FONT,
              fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}