import { useState, useEffect } from "react";

const tacosBestSellers = [
  { id: 1, name: "Taco Al Pastor", desc: "Carne de cerdo marinada, piña, cebolla y cilantro", price: "$25", emoji: "🌮", tag: "⭐ #1 más pedido" },
  { id: 2, name: "Taco de Bistec", desc: "Bistec asado, guacamole, salsa roja y limón", price: "$28", emoji: "🥩", tag: "🔥 Favorito del día" },
  { id: 3, name: "Taco de Suadero", desc: "Suadero dorado, cebolla, cilantro y salsa verde", price: "$26", emoji: "🫔", tag: "💚 Clásico" },
];

const confettiColors = ["#E63946", "#F4A261", "#2A9D8F", "#E9C46A", "#264653", "#F77F00"];

function PapelPicadoBanner() {
  const triangles = Array.from({ length: 18 });
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "0px",
      width: "100%",
      overflow: "hidden",
      lineHeight: 0,
      marginBottom: "-2px",
    }}>
      {triangles.map((_, i) => (
        <div key={i} style={{
          width: 0,
          height: 0,
          borderLeft: "28px solid transparent",
          borderRight: "28px solid transparent",
          borderTop: `42px solid ${confettiColors[i % confettiColors.length]}`,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }} />
      ))}
    </div>
  );
}

function StarRating({ rating = 4.8 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize: "18px", color: s <= Math.floor(rating) ? "#F4A261" : "#ccc" }}>★</span>
      ))}
      <span style={{ fontFamily: "'Courier New', monospace", fontWeight: "bold", color: "#264653", marginLeft: "4px" }}>{rating}</span>
    </div>
  );
}

function TacoCard({ taco, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#FFF8EE" : "#FFFDF7",
        border: `3px solid ${confettiColors[index % confettiColors.length]}`,
        borderRadius: "16px",
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        cursor: "pointer",
        transform: hovered ? "translateY(-6px) rotate(-1deg)" : "translateY(0) rotate(0)",
        transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.15), 4px 4px 0 ${confettiColors[index % confettiColors.length]}`
          : `3px 3px 0 ${confettiColors[index % confettiColors.length]}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span style={{
        position: "absolute", top: "10px", right: "12px",
        background: confettiColors[index % confettiColors.length],
        color: "#fff",
        fontSize: "10px",
        fontWeight: "800",
        fontFamily: "'Georgia', serif",
        padding: "2px 8px",
        borderRadius: "20px",
        letterSpacing: "0.5px",
      }}>{taco.tag}</span>
      <div style={{ fontSize: "48px", textAlign: "center", marginTop: "8px" }}>{taco.emoji}</div>
      <h3 style={{
        margin: 0,
        fontFamily: "'Georgia', serif",
        fontWeight: "900",
        fontSize: "17px",
        color: "#264653",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>{taco.name}</h3>
      <p style={{
        margin: 0,
        fontFamily: "'Courier New', monospace",
        fontSize: "12px",
        color: "#666",
        lineHeight: "1.5",
      }}>{taco.desc}</p>
      <div style={{
        marginTop: "auto",
        paddingTop: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: "'Georgia', serif",
          fontWeight: "900",
          fontSize: "22px",
          color: "#E63946",
        }}>{taco.price}</span>
        <button style={{
          background: "#E63946",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "6px 14px",
          fontFamily: "'Georgia', serif",
          fontWeight: "700",
          fontSize: "13px",
          cursor: "pointer",
          letterSpacing: "0.5px",
        }}>+ Agregar</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? "¡Buenos días!" : hour < 19 ? "¡Buenas tardes!" : "¡Buenas noches!";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFFDF7",
      fontFamily: "'Georgia', serif",
      overflowX: "hidden",
    }}>

      {/* HEADER */}
      <header style={{
        background: "#264653",
        padding: "0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "32px" }}>🌮</span>
            <div>
              <div style={{
                color: "#F4A261",
                fontWeight: "900",
                fontSize: "22px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                lineHeight: 1,
              }}>iTaquito</div>
              <div style={{ color: "#aaa", fontSize: "11px", fontFamily: "Courier New, monospace" }}>Mesa #4</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button style={{
              background: "transparent",
              border: "2px solid #F4A261",
              color: "#F4A261",
              borderRadius: "8px",
              padding: "6px 14px",
              fontFamily: "'Georgia', serif",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              letterSpacing: "0.5px",
            }}>🎵 Canciones</button>
            <button style={{
              background: "#E63946",
              border: "none",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 18px",
              fontFamily: "'Georgia', serif",
              fontWeight: "800",
              fontSize: "14px",
              cursor: "pointer",
              letterSpacing: "0.5px",
              boxShadow: "3px 3px 0 #9B1D23",
            }}>🛒 Carrito (0)</button>
          </div>
        </div>
      </header>

      {/* PAPEL PICADO */}
      <PapelPicadoBanner />

      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, #E63946 0%, #F77F00 50%, #E9C46A 100%)",
        padding: "60px 24px 50px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-40px", left: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "-20px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(0,0,0,0.06)" }} />

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s cubic-bezier(.34,1.2,.64,1)",
        }}>
          <p style={{
            color: "rgba(255,255,255,0.9)",
            fontFamily: "'Courier New', monospace",
            fontSize: "14px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            margin: "0 0 10px",
          }}>{greeting} 👋  •  {currentTime.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</p>
          <h1 style={{
            color: "#fff",
            fontSize: "clamp(36px, 8vw, 72px)",
            fontWeight: "900",
            margin: "0 0 10px",
            lineHeight: 1.1,
            textShadow: "4px 4px 0 rgba(0,0,0,0.15)",
            letterSpacing: "-1px",
          }}>
            BIENVENIDO A<br />
            <span style={{ color: "#264653" }}>iTaquito</span> 🌮
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.95)",
            fontSize: "17px",
            margin: "0 0 30px",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.5px",
          }}>¡Pide en 30 segundos, disfruta al instante!</p>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{
              background: "#264653",
              color: "#F4A261",
              border: "none",
              borderRadius: "12px",
              padding: "16px 36px",
              fontFamily: "'Georgia', serif",
              fontWeight: "900",
              fontSize: "17px",
              cursor: "pointer",
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.2)",
              transform: "rotate(-1deg)",
              transition: "all 0.2s",
            }}>🍽️ Ver Menú Completo</button>
            <button style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              border: "3px solid #fff",
              borderRadius: "12px",
              padding: "16px 28px",
              fontFamily: "'Georgia', serif",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              letterSpacing: "0.5px",
              transform: "rotate(0.5deg)",
            }}>⭐ Ver Reseñas</button>
          </div>
        </div>
      </section>

      <PapelPicadoBanner />

      {/* STATS BAR */}
      <section style={{
        background: "#264653",
        padding: "14px 24px",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          {[
            { icon: "🌮", label: "Pedidos hoy", value: "127" },
            { icon: "⏱️", label: "Espera aprox.", value: "~8 min" },
            { icon: "⭐", label: "Calificación", value: "4.8 / 5" },
            { icon: "🎵", label: "En cola", value: "3 canciones" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px" }}>{stat.icon}</div>
              <div style={{ color: "#F4A261", fontWeight: "900", fontSize: "18px", fontFamily: "'Georgia', serif" }}>{stat.value}</div>
              <div style={{ color: "#aaa", fontSize: "11px", fontFamily: "'Courier New', monospace", letterSpacing: "1px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LO MAS PEDIDO */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "50px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
          <div style={{
            background: "#E63946",
            width: "8px",
            height: "44px",
            borderRadius: "4px",
            flexShrink: 0,
          }} />
          <div>
            <h2 style={{
              margin: 0,
              fontFamily: "'Georgia', serif",
              fontWeight: "900",
              fontSize: "clamp(22px, 5vw, 32px)",
              color: "#264653",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>Lo Más Pedido Hoy 🔥</h2>
            <p style={{ margin: "2px 0 0", color: "#888", fontFamily: "Courier New, monospace", fontSize: "13px" }}>Los favoritos de nuestra mesa</p>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}>
          {tacosBestSellers.map((taco, i) => (
            <TacoCard key={taco.id} taco={taco} index={i} />
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section style={{
        background: "#E9C46A",
        padding: "30px 24px",
        margin: "0 0 0 0",
        borderTop: "4px solid #F77F00",
        borderBottom: "4px solid #F77F00",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontWeight: "900", fontSize: "22px", color: "#264653", fontFamily: "'Georgia', serif", textTransform: "uppercase" }}>
              🎉 Promoción del Día
            </div>
            <div style={{ color: "#555", fontFamily: "Courier New, monospace", fontSize: "14px", marginTop: "4px" }}>
              3 tacos al pastor + agua fresca — solo <strong style={{ color: "#E63946" }}>$75</strong>
            </div>
          </div>
          <button style={{
            background: "#264653",
            color: "#F4A261",
            border: "none",
            borderRadius: "10px",
            padding: "12px 26px",
            fontFamily: "'Georgia', serif",
            fontWeight: "800",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.15)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>¡Quiero esta promo!</button>
        </div>
      </section>

      {/* RESEÑAS */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "50px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
          <div style={{ background: "#2A9D8F", width: "8px", height: "44px", borderRadius: "4px", flexShrink: 0 }} />
          <h2 style={{
            margin: 0,
            fontFamily: "'Georgia', serif",
            fontWeight: "900",
            fontSize: "clamp(22px, 5vw, 32px)",
            color: "#264653",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}>Lo Que Dicen Nuestros Clientes ⭐</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
          {[
            { name: "María G.", comment: "Los tacos de suadero están increíbles, el sabor es único. ¡Siempre vuelvo!", stars: 5, date: "Hace 2 días" },
            { name: "Carlos R.", comment: "Super rápido el sistema de pedidos. Pedí desde la mesa y llegó en 7 min. ¡Excelente!", stars: 5, date: "Ayer" },
            { name: "Ana P.", comment: "Me encantó pedir la canción desde la tablet. Muy buena experiencia 🎵", stars: 4, date: "Hoy" },
          ].map((r, i) => (
            <div key={i} style={{
              background: "#FFFDF7",
              border: "2px solid #E9C46A",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "3px 3px 0 #E9C46A",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontWeight: "800", color: "#264653", fontFamily: "'Georgia', serif" }}>{r.name}</span>
                <span style={{ color: "#aaa", fontSize: "11px", fontFamily: "Courier New, monospace" }}>{r.date}</span>
              </div>
              <StarRating rating={r.stars} />
              <p style={{ margin: "10px 0 0", color: "#555", fontFamily: "Courier New, monospace", fontSize: "13px", lineHeight: 1.6 }}>"{r.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#264653",
        padding: "30px 24px",
        textAlign: "center",
      }}>
        <PapelPicadoBanner />
        <div style={{ paddingTop: "24px" }}>
          <span style={{ fontSize: "32px" }}>🌮</span>
          <p style={{ color: "#F4A261", fontWeight: "900", fontFamily: "'Georgia', serif", fontSize: "18px", margin: "8px 0 4px", textTransform: "uppercase", letterSpacing: "2px" }}>
            iTaquito
          </p>
          <p style={{ color: "#888", fontFamily: "Courier New, monospace", fontSize: "12px", margin: 0 }}>
            La experiencia taquera del futuro 🇲🇽
          </p>
        </div>
      </footer>
    </div>
  );
}