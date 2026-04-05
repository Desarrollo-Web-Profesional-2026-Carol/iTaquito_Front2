
export const C = {
  // ── Colores de acento  ──────────────────────────────
  pink:          "#5A8A3C",   // Verde lima (aguacate/cilantro) — vibra taquería
  pinkDim:       "#3F6229",
  pinkLight:     "#8ABF6A",

  orange:        "#D47A4A",   // Naranja quemado (chile/tamarindo)
  orangeDim:     "#A85C38",
  orangeLight:   "#EAA684",

  yellow:        "#D1AB5C",   // Mostaza/Maíz
  yellowDim:     "#9E8144",

  teal:          "#6A9C89",   // Salvia
  tealDim:       "#4C6E60",
  tealLight:     "#9CCBBA",

  purple:        "#8E7B9D",   // Morado deslavado
  purpleDim:     "#655770",
  purpleLight:   "#B4A4C2",

  // ── Fondos (claro mate) ─────────────────────────────
  bg:            "#FAF6F0",   // Fondo crema claro principal
  bgCard:        "#F2EBE1",   // Cards y paneles (Beige)
  bgCardHov:     "#E6DEC8",   // Hover en panel
  bgAccent:      "#E8E0D2",   // Zonas grises/arena

  // ── Bordes ────────────────────────────────────────────────────
  border:        "#D1C1AA",   // Borde suave
  borderBright:  "#B3A38F",   // Borde con un poco más de peso

  // ── Textos ────────────────────────────────────────────────────
  cream:         "#4A3F35",   // Títulos (Café oscuro para contraste sobre beige)
  textPrimary:   "#4A3F35",   // Texto general
  textSecondary: "#7A6B5D",   // Subtítulos
  textMuted:     "#A19280",   // Texto desactivado

  // ── Utilidades ────────────────────────────────────────────────
  white:         "#FFFFFF",
  success:       "#6A9C89",   // Verde
  error:         "#C0392B",   // Error (rojo)
  warning:       "#D1AB5C",   // Advertencia
};

// ─── FUENTE ───────────────────────────────────────────────────────
// Agregar en index.html:
// <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&display=swap" rel="stylesheet">
export const FONT = "'Quicksand', sans-serif";

// ─── PAPEL PICADO ─────────────────────────────────────────────────
export const PICADO = [
  C.pink,
  C.orange,
  C.yellow,
  C.teal,
  C.purple,
  C.pinkDim,
  C.orangeDim,
  C.tealDim,
  C.purpleDim,
];

// ─── COLORES POR ROL ──────────────────────────────────────────────
export const ROLE_COLORS = {
  admin:   C.pink,
  mesero:  C.orange,
  cajero:  C.yellow,
  caja:    C.yellow,
  mesa:    C.teal,
  taquero: C.purple,
};

// ─── SOMBRAS NEÓN (helpers) ───────────────────────────────────────
export const glow = (color, intensity = "55") => `none`;

export const glowLg = (color, intensity = "44") => `none`;